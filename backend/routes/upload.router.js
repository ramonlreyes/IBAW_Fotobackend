import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";
import mongoose from "mongoose";
import Album from "../models/album.model.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      if (!req.albumFolderName) {
        if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
          req.albumId = req.params.id;

          const existingAlbum = await Album.findById(req.albumId);
          if (existingAlbum) {
            req.albumFolderName = `${existingAlbum.title.replace(/\s+/g, '_')}-${existingAlbum._id}`;
          } else {
            return cb(new Error("Album not found"), false);
          }
        } else if (!req.albumId) {
          req.albumId = new mongoose.Types.ObjectId();
          const albumTitle = req.body.title || "default";
          req.albumFolderName = `${albumTitle.replace(/\s+/g, '_')}-${req.albumId}`;
        }
      }

      const uploadPath = path.join(__dirname, "..", "..", "uploads", req.albumFolderName);

      fs.mkdir(uploadPath, { recursive: true }, (error) => {
        if (error) {
          console.log("Error in mkdir:", error);
          return cb(error);
        }
        cb(null, uploadPath);
      });
    } catch (error) {
      console.error("Error in destination function:", error);
      cb(error, false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});

const fileFilter = ( req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if(allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type, Only JPEG, PNG, GIF, and WEP allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadMiddleware = upload.fields([
  { name: "cover", maxCount: 1 }, 
  { name: "images" }
]);


export default upload;
