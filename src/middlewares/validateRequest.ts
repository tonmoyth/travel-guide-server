import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import AppError from "../errors/AppError";

const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.body.data) {
        req.body = JSON.parse(req.body.data);
      }

      const parsedData = schema.safeParse(req.body);

      if (!parsedData.success) {
        const errorMessages = parsedData.error.issues
          .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
          .join("; ");
        throw new AppError(400, `Validation error: ${errorMessages}`);
      }

      req.body = parsedData.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
