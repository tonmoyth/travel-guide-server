/* eslint-disable @typescript-eslint/no-explicit-any */
import Stripe from "stripe";
import { Request, Response } from "express";
import status from "http-status";
import { PaymentService } from "./payment.service";
import { catchAsync } from "../../shared/catchAsync";
import { envVeriables } from "../../config/env";
import { stripe } from "../../config/stripe";

const createPaymentSession = catchAsync(async (req: Request, res: Response) => {
  const memberId = req.user!.id;
  const { guideId } = req.body;

  if (!guideId) {
    return res.status(status.BAD_REQUEST).json({
      success: false,
      message: "guideId is required",
    });
  }

  const result = await PaymentService.createCheckoutSession(memberId, guideId);

  res.status(status.OK).json({
    success: true,
    message: "Checkout session created",
    data: result,
  });
});

const handleStripeWebhookEvent = catchAsync(
  async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"] as string | undefined;
    const webhookSecret = envVeriables.STRIPE_WEBHOOK_SECRET;

    if (!signature || !webhookSecret) {
      console.error("Missing Stripe signature or webhook secret");
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Missing Stripe signature or webhook secret",
      });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        webhookSecret,
      );
    } catch (error: any) {
      console.error("Error processing Stripe webhook:", error);
      return res.status(status.BAD_REQUEST).json({
        success: false,
        message: "Error processing Stripe webhook",
        error: error.message,
      });
    }

    const result = await PaymentService.handlerStripeWebhookEvent(event);

    res.status(status.OK).json({
      success: true,
      message: "Stripe webhook event processed successfully",
      data: result,
    });
  },
);

export const PaymentController = {
  createPaymentSession,
  handleStripeWebhookEvent,
};
