import { Router } from "express";
import {
  getListings,
  getListing,
  createListing,
  updateListing,
  deleteListing,
  createReport,
} from "../controllers/listing.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { createListingSchema, updateListingSchema, reportSchema } from "../utils/validation.js";

const router = Router();

router.get("/", getListings);
router.get("/:id", getListing);
router.post(
  "/",
  authMiddleware,
  upload.array("images", 3),
  validate(createListingSchema),
  createListing
);
router.put("/:id", authMiddleware, validate(updateListingSchema), updateListing);
router.delete("/:id", authMiddleware, deleteListing);
router.post("/:id/report", authMiddleware, validate(reportSchema), createReport);

export default router;
