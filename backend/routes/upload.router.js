import multer from "multer";
import path from "path";
import fs from "fs";
import mongoose from "mongoose";
import Album from "../models/album.model.js";
import { getUploadsDir, normalizeTitle } from "../utils/path.helper.js";
import { handleMulterError } from "../utils/error.handling.js"; 

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if(req.method === 'DELETE'){
      return cb(null, '');
    }
   
    try {
      if (!req.albumFolderName) {
        // Case 1: Updating an existing album
        if (req.params.id && mongoose.Types.ObjectId.isValid(req.params.id)) {
          req.albumId = req.params.id;
          const existingAlbum = await Album.findById(req.albumId);
          
          if (!existingAlbum) {
            // We can't return a response here, but we'll pass an error to multer
            // which will be handled by our custom error handler
            return cb(new Error("Album not found"), false);
          }
          
          const oldTitle = existingAlbum.title;
          const oldFolderName = `${normalizeTitle(oldTitle)}-${existingAlbum._id}`;
          const oldFolderPath = path.join(getUploadsDir(), oldFolderName);
           
          // Check if title has changed
          if(req.body.title && req.body.title !== oldTitle) {
            const newFolderName = `${normalizeTitle(req.body.title)}-${existingAlbum._id}`;
            const newFolderPath = path.join(getUploadsDir(), newFolderName);
             
            // Perform the folder rename operation
            if(fs.existsSync(oldFolderPath)) {
              try {
                fs.renameSync(oldFolderPath, newFolderPath);
              } catch (renameError) {
                return cb(new Error(`Failed to rename folder: ${renameError.message}`), false);
              }
            } else {
              try {
                fs.mkdirSync(newFolderPath, { recursive: true });
              } catch (mkdirError) {
                return cb(new Error(`Failed to create folder: ${mkdirError.message}`), false);
              }
            }
            
            req.albumFolderName = newFolderName;
          } else {
            req.albumFolderName = oldFolderName;
          }
        } 
        // Case 2: Creating a new album
        else {
          req.albumId = new mongoose.Types.ObjectId();
          const albumTitle = req.body.title || "default";
          req.albumFolderName = `${normalizeTitle(albumTitle)}-${req.albumId}`;
        }
      }
      
      // Use getUploadsDir helper for the path
      const uploadPath = path.join(getUploadsDir(), req.albumFolderName);
      
      // Ensure directory exists
      if (!fs.existsSync(uploadPath)) {
        try {
          fs.mkdirSync(uploadPath, { recursive: true });
        } catch (mkdirError) {
          return cb(new Error(`Failed to create upload directory: ${mkdirError.message}`), false);
        }
      }
      
      cb(null, uploadPath);
    } catch (error) {
      return cb(new Error(`Server error in upload destination: ${error.message}`), false);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if(allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WEBP allowed'), false);
  }
};

const upload = multer({ storage, fileFilter });

export const uploadMiddleware = (req, res, next) => {
  // Special handling for PUT requests without files
  if (req.method === 'PUT' && (!req.is('multipart/form-data'))) {
    // Process title change directly if no files are being uploaded
    (async () => {
      try {
        if (req.params.id && req.body.title) {
          const album = await Album.findById(req.params.id);
          if (!album) {
            return res.status(404).json({success: false, message: 'Album not found'});
          }
          
          if (album.title !== req.body.title) {
            const oldFolderName = `${normalizeTitle(album.title)}-${album._id}`;
            const oldFolderPath = path.join(getUploadsDir(), oldFolderName);
            
            const newFolderName = `${normalizeTitle(req.body.title)}-${album._id}`;
            const newFolderPath = path.join(getUploadsDir(), newFolderName);
            
            if (fs.existsSync(oldFolderPath)) {
              try {
                fs.renameSync(oldFolderPath, newFolderPath);
                album.title = req.body.title;
                
                // Update image paths
                if(album.cover) {
                  const coverFilename = path.basename(album.cover);
                  album.cover = `/uploads/${newFolderName}/${coverFilename}`;
                }
                
                if(album.images && album.images.length > 0) {
                  album.images = album.images.map(imageUrl => {
                    const imageFilename = path.basename(imageUrl);
                    return `/uploads/${newFolderName}/${imageFilename}`;
                  });
                }
                
                await album.save();
              } catch (error) {
                return res.status(500).json({success: false, message: 'Error renaming album folder'});
              }
            } else {
              return res.status(404).json({success: false, message: 'Album folder not found'});
            }
          }
        }
      } catch (error) {
        return res.status(500).json({success: false, message: 'Server Error'});
      }
      next();
    })();
    return;
  }
  
  // For multipart requests with file uploads
  const uploadHandler = upload.fields([
    { name: "cover", maxCount: 1 }, 
    { name: "images" }
  ]);
  
  uploadHandler(req, res, (err) => {
    if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    next();
  });
};

export default upload;