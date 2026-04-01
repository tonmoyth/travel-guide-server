import { prisma } from "../../lib/prisma";
import AppError from "../../errors/AppError";

export type TNewsletterSubscription = {
  id: string;
  email: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const createSubscription = async (email: string) => {
  if (!email) {
    throw new AppError(400, "Email is required");
  }

  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email },
  });

  if (existing && !existing.isDeleted) {
    throw new AppError(400, "Email already subscribed");
  }

  if (existing && existing.isDeleted) {
    return await prisma.newsletterSubscription.update({
      where: { email },
      data: { isDeleted: false },
    });
  }

  const subscription = await prisma.newsletterSubscription.create({
    data: { email },
  });

  return subscription;
};

const getAllSubscriptions = async () => {
  const subscriptions = await prisma.newsletterSubscription.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: "desc" },
  });

  return subscriptions;
};

const unsubscribe = async (email: string) => {
  if (!email) {
    throw new AppError(400, "Email is required to unsubscribe");
  }

  const existing = await prisma.newsletterSubscription.findUnique({
    where: { email },
  });

  if (!existing || existing.isDeleted) {
    throw new AppError(404, "Subscription not found");
  }

  return await prisma.newsletterSubscription.update({
    where: { email },
    data: { isDeleted: true },
  });
};

export const NewsletterService = {
  createSubscription,
  getAllSubscriptions,
  unsubscribe,
};
