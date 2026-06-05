import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { validate } from "../middleware/validate.middleware.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../utils/validation.js";

const router = Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/me", authMiddleware, me);

export default router;
