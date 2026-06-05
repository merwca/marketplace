import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/index.js";
import { hashPassword, comparePassword } from "../utils/hash.js";

const prisma = new PrismaClient();

export async function getProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch profile" });
  }
}

export async function updateProfile(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { name, email, password } = req.body;

    // Check if email is being changed and if it's already in use
    if (email) {
      const existing = await prisma.user.findUnique({
        where: { email },
      });

      if (existing && existing.id !== req.user.id) {
        return res.status(409).json({ success: false, error: "Email already in use" });
      }
    }

    const data: any = {};
    if (name) data.name = name;
    if (email) data.email = email;
    if (password) data.password = await hashPassword(password);

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: { id: true, email: true, name: true, role: true },
    });

    res.json({ success: true, message: "Profile updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update profile" });
  }
}

export async function getUserListings(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const listings = await prisma.listing.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: listings });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch listings" });
  }
}
