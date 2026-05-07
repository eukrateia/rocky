import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";
import { login, logout, me, refresh, register } from "./auth.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, me);

export default router;
