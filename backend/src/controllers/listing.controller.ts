import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/index.js";

const prisma = new PrismaClient();

export async function getListings(req: AuthRequest, res: Response) {
  try {
    const {
      q,
      category,
      city,
      page = "1",
      limit = "20",
    } = req.query as Record<string, string>;

    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const where: any = { active: true };

    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { description: { contains: q, mode: "insensitive" } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (city) {
      where.city = { contains: city, mode: "insensitive" };
    }

    const [listings, total] = await Promise.all([
      prisma.listing.findMany({
        where,
        include: { user: { select: { id: true, name: true, email: true } } },
        orderBy: { createdAt: "desc" },
        skip,
        take: limitNum,
      }),
      prisma.listing.count({ where }),
    ]);

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

export async function getListing(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;

    const listing = await prisma.listing.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        reports: { select: { id: true, reason: true } },
      },
    });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    // Fetch related listings (same category, excluding this one)
    const related = await prisma.listing.findMany({
      where: {
        category: listing.category,
        id: { not: listing.id },
        active: true,
      },
      include: { user: { select: { id: true, name: true } } },
      take: 5,
      orderBy: { createdAt: "desc" },
    });

    res.json({ success: true, data: { listing, related } });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch listing" });
  }
}

export async function createListing(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { title, description, price, category, city, contactEmail } = req.body;
    const files = (req.files as any[]) || [];

    const images = files.map((f) => f.filename);

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        price: price ? parseFloat(price) : null,
        category,
        city,
        contactEmail,
        images,
        userId: req.user.id,
      },
    });

    res
      .status(201)
      .json({ success: true, message: "Listing created", data: listing });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create listing" });
  }
}

export async function updateListing(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { id } = req.params;
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    if (listing.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    const updated = await prisma.listing.update({
      where: { id },
      data: { ...req.body, price: req.body.price ? parseFloat(req.body.price) : undefined },
    });

    res.json({ success: true, message: "Listing updated", data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to update listing" });
  }
}

export async function deleteListing(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { id } = req.params;
    const listing = await prisma.listing.findUnique({ where: { id } });

    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    if (listing.userId !== req.user.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    await prisma.listing.delete({ where: { id } });

    res.json({ success: true, message: "Listing deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete listing" });
  }
}

export async function createReport(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { id } = req.params;
    const { reason } = req.body;

    const listing = await prisma.listing.findUnique({ where: { id } });
    if (!listing) {
      return res.status(404).json({ success: false, error: "Listing not found" });
    }

    const report = await prisma.report.create({
      data: { reason, listingId: id, userId: req.user.id },
    });

    res.status(201).json({ success: true, message: "Report submitted", data: report });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to create report" });
  }
}
