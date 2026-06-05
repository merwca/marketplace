import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest, LoginResponse } from "../types/index.js";
import { hashPassword, comparePassword } from "../utils/hash.js";
import { generateToken } from "../utils/jwt.js";

const prisma = new PrismaClient();

export async function register(req: AuthRequest, res: Response) {
  try {
    const { name, email, password } = req.body;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await hashPassword(password);
    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      } as LoginResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Registration failed" });
  }
}

export async function login(req: AuthRequest, res: Response) {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    if (user.banned) {
      return res.status(403).json({ success: false, error: "Account banned" });
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({ success: false, error: "Invalid credentials" });
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      data: {
        token,
        user: { id: user.id, email: user.email, name: user.name, role: user.role },
      } as LoginResponse,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Login failed" });
  }
}

export async function me(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch user" });
  }
}
