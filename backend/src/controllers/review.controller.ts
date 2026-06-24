import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../types/index.js";

const prisma = new PrismaClient();

export async function getSellerReviews(req: AuthRequest, res: Response) {
  try {
    const { sellerId } = req.params;

    const reviews = await prisma.review.findMany({
      where: { sellerId },
      include: {
        reviewer: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avgRating = reviews.length > 0 ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10 : 0;

    res.json({
      success: true,
      data: {
        reviews,
        stats: {
          totalReviews: reviews.length,
          averageRating: avgRating,
          ratingBreakdown: {
            5: reviews.filter((r) => r.rating === 5).length,
            4: reviews.filter((r) => r.rating === 4).length,
            3: reviews.filter((r) => r.rating === 3).length,
            2: reviews.filter((r) => r.rating === 2).length,
            1: reviews.filter((r) => r.rating === 1).length,
          },
        },
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to fetch reviews" });
  }
}

export async function createReview(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { sellerId, listingId, rating, text } = req.body;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: "Rating must be between 1 and 5" });
    }

    // Check if review already exists
    const existingReview = await prisma.review.findUnique({
      where: {
        reviewerId_sellerId: {
          reviewerId: req.user.id,
          sellerId,
        },
      },
    });

    if (existingReview) {
      return res.status(400).json({ success: false, error: "You have already reviewed this seller" });
    }

    // Create review
    const review = await prisma.review.create({
      data: {
        rating,
        text: text || null,
        reviewerId: req.user.id,
        sellerId,
        listingId,
      },
      include: {
        reviewer: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: "Review created successfully",
      data: review,
    });
  } catch (error) {
    console.error("createReview error:", error);
    res.status(500).json({ success: false, error: "Failed to create review" });
  }
}

export async function deleteReview(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const { reviewId } = req.params;

    const review = await prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return res.status(404).json({ success: false, error: "Review not found" });
    }

    // Only reviewer or admin can delete
    if (review.reviewerId !== req.user.id) {
      return res.status(403).json({ success: false, error: "Forbidden" });
    }

    await prisma.review.delete({
      where: { id: reviewId },
    });

    res.json({ success: true, message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Failed to delete review" });
  }
}
