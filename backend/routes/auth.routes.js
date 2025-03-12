import express from "express";
import { registerUser, loginUser } from "../controllers/auth.controller.js";

const router = express.Router();

router.post('/singup', registerUser);
router.post('/login', loginUser);

export { router as authRoutes };