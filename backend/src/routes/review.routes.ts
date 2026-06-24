import { Router } from "express";
import { getSellerReviews, createReview, deleteReview } from "../controllers/review.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { z } from "zod";

const router = Router();

const createReviewSchema = z.object({
  sellerId: z.string().min(1),
  listingId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  text: z.string().optional(),
});

// Get reviews for a seller
router.get("/seller/:sellerId", getSellerReviews);

// Create a review
router.post("/", authMiddleware, validate(createReviewSchema), createReview);

// Delete a review
router.delete("/:reviewId", authMiddleware, deleteReview);

export default router;
