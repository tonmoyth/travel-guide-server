/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";

import { prisma } from "../../lib/prisma";
import { PaymentStatus } from "../../../prisma/generated/prisma/enums";
import { envVeriables } from "../../config/env";
import { stripe } from "../../config/stripe";
import AppError from "../../errors/AppError";
import { stat } from "node:fs";
import status from "http-status";

const createCheckoutSession = async (userId: string, guideId: string) => {
  const guide = await prisma.travelGuide.findUnique({ where: { id: guideId } });

  if (!guide) {
    throw new Error("Travel guide not found");
  }

  if (!guide.isPaid || !guide.price || guide.price <= 0) {
    throw new Error("This guide is not eligible for purchase");
  }

  if (!envVeriables.FRONTEND_URL) {
    throw new Error("Missing FRONTEND_URL in environment");
  }

  const parchaseExists = await prisma.purchase.findFirst({
    where: {
      memberId: userId,
      guideId: guide.id,
    },
  });

  if (parchaseExists?.paymentStatus === PaymentStatus.PENDING) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have an existing pending purchase for this guide. Please complete or wait for it to expire before creating a new one.",
    );
  }

  if (parchaseExists?.paymentStatus === PaymentStatus.COMPLETED) {
    throw new AppError(
      status.BAD_REQUEST,
      "You have already purchased this guide",
    );
  }

  const purchase = await prisma.purchase.create({
    data: {
      memberId: userId,
      guideId: guide.id,
      amount: guide.price,
      paymentStatus: PaymentStatus.PENDING,
      paymentMethod: "STRIPE",
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: undefined,
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: guide.title,
            description: guide.description,
          },
          unit_amount: Math.round(guide.price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: {
      purchaseId: purchase.id,
      memberId: userId,
      guideId: guide.id,
    },
    success_url: `${envVeriables.FRONTEND_URL}/payment-success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${envVeriables.FRONTEND_URL}/payment-cancel`,
    expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
  });

  if (!session.url) {
    throw new Error("Unable to create Stripe checkout session");
  }

  return {
    purchase,
    checkoutUrl: session.url,
    sessionId: session.id,
  };
};

const handlerStripeWebhookEvent = async (event: Stripe.Event) => {
  const dataObject = event.data.object as any;
  const purchaseId = dataObject.metadata?.purchaseId as string | undefined;

  if (!purchaseId) {
    console.error("Stripe event missing purchaseId metadata");
    return { message: "Stripe event missing purchaseId metadata" };
  }

  const existingPurchase = await prisma.purchase.findUnique({
    where: { id: purchaseId },
  });
  if (!existingPurchase) {
    console.error(`Purchase ${purchaseId} not found`);
    return { message: `Purchase ${purchaseId} not found` };
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const paymentIntentId = dataObject.payment_intent as string | undefined;
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          paymentStatus: PaymentStatus.COMPLETED,
          transactionId: paymentIntentId ?? null,
        },
      });
      break;
    }
    case "checkout.session.expired": {
      await prisma.purchase.update({
        where: { id: purchaseId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
        },
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const paymentIntentId = dataObject.id as string | undefined;
      const updateId =
        existingPurchase.transactionId === paymentIntentId
          ? purchaseId
          : purchaseId;
      await prisma.purchase.update({
        where: { id: updateId },
        data: {
          paymentStatus: PaymentStatus.FAILED,
          transactionId: paymentIntentId ?? existingPurchase.transactionId,
        },
      });
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  return { message: `Webhook Event ${event.id} processed successfully` };
};

export const PaymentService = {
  createCheckoutSession,
  handlerStripeWebhookEvent,
};
