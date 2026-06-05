import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/index.js";

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ success: false, error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      id: string;
      email: string;
      role: "USER" | "ADMIN";
    };
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ success: false, error: "Invalid token" });
  }
}
