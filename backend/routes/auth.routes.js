import express from "express";
import { registerUser, loginUser, logoutUser, verifyToken, refreshToken } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.post('/refresh', refreshToken);
router.get('/verify', protect, verifyToken);

export { router as authRoutes };