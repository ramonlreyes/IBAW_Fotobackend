import express from "express";
import { registerUser, loginUser, logoutUser, verifyToken } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/verify', protect, verifyToken);

export { router as authRoutes };