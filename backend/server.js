import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { albumRoutes } from "./routes/album.route.js";
import { authRoutes } from "./routes/auth.routes.js";
import rateLimit from "express-rate-limit";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);


const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 700, 
  message: 'Too many requests, please try again later.',
  standardHeaders: true, 
  legacyHeaders: false, 
});


const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, 
  message: 'Too many authentication attempts, please try again later.',
  skipSuccessfulRequests: true, // Don't count successful requests
});


const writeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, 
  message: 'Too many write operations, please try again later.',
});


const staticFileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 2000, 
  message: 'Too many file requests, please try again later.',
});

app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-domain.com' 
    : [ 'http://localhost:80',
        'http://localhost:5173',
        'http://localhost:3000'
      ],
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());


app.use('/api/auth', authLimiter, authRoutes);


app.use('/api/albums', (req, res, next) => {
  if (['POST', 'PUT', 'DELETE'].includes(req.method)) {
    writeLimiter(req, res, next);
  } else {
    generalLimiter(req, res, next);
  }
}, albumRoutes);


app.use("/uploads", staticFileLimiter, express.static(path.join(__dirname, 'uploads')));


app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

app.use(generalLimiter);

app.listen(PORT, () => {
  connectDB();
  console.log('Server started at localhost:' + PORT);
});