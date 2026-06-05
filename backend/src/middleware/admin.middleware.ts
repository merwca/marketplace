import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/index.js";

export function adminMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ success: false, error: "Forbidden" });
  }
  next();
}
