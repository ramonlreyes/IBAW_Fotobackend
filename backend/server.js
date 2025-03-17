import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { albumRoutes } from "./routes/album.route.js";
import { authRoutes } from "./routes/auth.routes.js";
import rateLimit from "express-rate-limit";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many Request, please try again later.'
});

app.use(express.json()); // allows us to acept JSON data in the req.body
app.use(limiter);

app.use('/api/albums', albumRoutes );
app.use('/api/auth', authRoutes);
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  connectDB();
  console.log('server started at localHost:' + PORT);
});
