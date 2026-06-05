import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/index.js";

const prisma = new PrismaClient();

export async function getAllListings(req: AuthRequest, res: Response) {
  try {
    const { active, reported, page = "1", limit = "50" } = req.query as Record<
      string,
      string
    >;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};

    if (active === "true" || active === "false") {
      where.active = active === "true";
    }

    let listings;
    let total;

    if (reported === "true") {
      // Get listings with reports
      const listingsWithReports = await prisma.listing.findMany({
        where,
        include: {
          reports: true,
          user: { select: { id: true, name: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
      });

      listings = listingsWithReports.filter((l) => l.reports.length > 0);
      total = listings.length;
      listings = listings.slice(skip, skip + limitNum);
    } else {
      [listings, total] = await Promise.all([
        prisma.listing.findMany({
          where,
          include: { user: { select: { id: true, name: true, email: true } } },
          orderBy: { createdAt: "desc" },
          skip,
          take: limitNum,
        }),
        prisma.listing.count({ where }),
      ]);
    }

    res.json({
      success: true,
      data: {
        listings,
        pagination: {
          page: pageNum,
          limit: limitNum,
          total,
          pages: Math.ceil(total / limitNum),
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch listings" });
  }
}

export async function deleteListing(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    await prisma.listing.delete({ where: { id } });

    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete listing" });
  }
}

export async function getAllUsers(req: AuthRequest, res: Response) {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        banned: true,
        createdAt: true,
        _count: { select: { listings: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch users" });
  }
}

export async function toggleUserBan(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { banned: !user.banned },
      select: { id: true, email: true, name: true, banned: true },
    });

    res.json({
      success: true,
      message: `User ${updated.banned ? "banned" : "unbanned"}`,
      data: updated,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update user" });
  }
}
