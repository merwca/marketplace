import { Router } from "express";
import {
  getAllListings,
  deleteListing,
  getAllUsers,
  toggleUserBan,
} from "../controllers/admin.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { adminMiddleware } from "../middleware/admin.middleware.js";

const router = Router();

router.get("/listings", authMiddleware, adminMiddleware, getAllListings);
router.delete("/listings/:id", authMiddleware, adminMiddleware, deleteListing);
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.put("/users/:id/ban", authMiddleware, adminMiddleware, toggleUserBan);

export default router;
