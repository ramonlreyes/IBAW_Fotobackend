import express from "express";
import { registerUser, loginUser, logoutUSer } from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUSer);

export { router as authRoutes };