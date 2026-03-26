import Stripe from "stripe";
import { envVeriables } from "./env";

export const stripe = new Stripe(envVeriables.STRIPE_SECRET_KEY);
