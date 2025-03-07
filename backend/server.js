import express from "express";
import path from "path";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import { albumRoutes } from "./routes/album.route.js";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use(express.json()); // allows us to acept JSON data in the req.body

app.use('/api/albums', albumRoutes );
app.use("/uploads", express.static(path.join(__dirname, 'uploads')));


app.listen(PORT, () => {
  connectDB();
  console.log('server started at localHost:' + PORT);
});


// LbVRV0dBqMr84SJs