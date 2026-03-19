import express, { Application, Request, Response } from "express";
import cors from "cors";
import { auth } from "./lib/auth";
import routes from "./routes";
import cookieParser from "cookie-parser";

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());
// auth routes
app.use("/api/auth", auth.handler);

// application routes
app.use("/api/v1", routes);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello travel guide server!");
});

export default app;
