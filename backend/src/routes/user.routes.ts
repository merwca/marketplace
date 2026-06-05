import { Router } from "express";
import {
  getProfile,
  updateProfile,
  getUserListings,
} from "../controllers/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { updateUserSchema } from "../utils/validation.js";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, validate(updateUserSchema), updateProfile);
router.get("/me/listings", authMiddleware, getUserListings);

export default router;
