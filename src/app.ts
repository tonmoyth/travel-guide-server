import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import routes from "./routes";
import cookieParser from "cookie-parser";
import { notFound } from "./middlewares/notFound";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import { PaymentController } from "./modules/payment/payment.controller";
import { envVeriables } from "./config/env";
import path from "path";

const app: Application = express();

// Webhook route must come BEFORE express.json() middleware
// because Stripe needs raw body for signature verification
app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  PaymentController.handleStripeWebhookEvent,
);

// app.set("view engine", "ejs");
// app.set("views", path.resolve(process.cwd(), "src/templates"));

// parsers
app.use(express.json());
app.use(
  cors({
    origin: envVeriables.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
// auth routes
app.use("/api/auth", auth.handler);

// application routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello travel guide server!");
});

app.use(globalErrorHandler);
app.use(notFound);
export default app;
