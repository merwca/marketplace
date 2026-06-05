import { Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { AuthRequest } from "../types/index.js";

export function validate(schema: ZodSchema) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: "Validation failed",
        details: error.errors,
      });
    }
  };
}
