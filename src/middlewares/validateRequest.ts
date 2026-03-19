import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

const validateRequest = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }
  };
};

export default validateRequest;
