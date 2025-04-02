import mongoose from "mongoose";
import Album from "../models/album.model.js";
import path from "path";
import fs from "fs";
import { getFotoPath, getAlbumDir, getUrlPath, getUploadsDir, normalizeTitle } from "../utils/path.helper.js";
import { handleApiError } from "../utils/error.handling.js";

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    res.status(200).json({success: true, data: albums});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbum = async (req, res) => {
  const { id } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, message: 'Invalid Album ID'});
    }

    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
    
    res.status(200).json({success: true, data: album});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title } = req.body;
    const albumId = req.albumId || new mongoose.Types.ObjectId();

    if(!title) {
      return res.status(400).json({success: false, message: 'Album title is required'});
    }

    if(!req.files || !req.files['cover']) {
      return res.status(400).json({success: false, message: 'Cover image is required'});
    }

    if(!req.files['images'] || req.files['images'].length === 0) {
      return res.status(400).json({success: false, message: 'At least one album image is required'});
    }

    // Using path helpers for consistent URL generation
    const coverUrl = getUrlPath(title, albumId, req.files['cover'][0].filename);
    const imagesUrls = req.files['images'].map((file) => getUrlPath(title, albumId, file.filename));

    const newAlbum = new Album({
      _id: albumId,
      title,
      cover: coverUrl,
      images: imagesUrls
    });

    await newAlbum.save();

    res.status(201).json({success: true, albumId: newAlbum._id, data: newAlbum});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const updateAlbum = async (req, res) => {
  const { id } = req.params;
  
  if(!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, message: 'Invalid Album ID'});
  }
  
  try {
    const album = await Album.findById(id);
    if(!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
   
    // Store the old title before changing it
    const oldTitle = album.title;
    const titleChanged = req.body.title && req.body.title !== oldTitle;
    
    // Check if the folder was renamed in the middleware
    if(titleChanged) {
      // Old and new folder paths
      const oldFolderName = `${normalizeTitle(oldTitle)}-${album._id}`;
      const oldFolderPath = path.join(getUploadsDir(), oldFolderName);
      
      const newFolderName = `${normalizeTitle(req.body.title)}-${album._id}`;
      const newFolderPath = path.join(getUploadsDir(), newFolderName);
      
      // Double-check folder rename if needed
      if (fs.existsSync(oldFolderPath) && !fs.existsSync(newFolderPath)) {
        try {
          fs.renameSync(oldFolderPath, newFolderPath);
        } catch (renameError) {
          return res.status(500).json({success: false, message: 'Error renaming album folder'});
        }
      }
      
      // Update the album title
      album.title = req.body.title;
      
      // Update paths for all images when title changes
      if(album.cover) {
        const coverFilename = path.basename(album.cover);
        const newCoverUrl = getUrlPath(req.body.title, album._id, coverFilename);
        album.cover = newCoverUrl;
      }
      
      if(album.images && album.images.length > 0) {
        const updatedImages = album.images.map(imageUrl => {
          const imageFilename = path.basename(imageUrl);
          const newImageUrl = getUrlPath(req.body.title, album._id, imageFilename);
          return newImageUrl;
        });
        album.images = updatedImages;
      }
    }
    
    // Handle new cover upload
    if(req.files && req.files['cover']) {
      // Delete old cover file if it exists
      if(album.cover) {
        try {
          const oldCoverFilename = path.basename(album.cover);
          const oldCoverPath = getFotoPath(album.title, album._id, oldCoverFilename);
          
          if(fs.existsSync(oldCoverPath)) {
            try {
              fs.unlinkSync(oldCoverPath);
            } catch (unlinkError) {
              // We'll continue even if we can't delete the old file
            }
          }
        } catch (error) {
          // Continue even if there's an error getting the old path
        }
      }
      
      // Set new cover URL using path helper
      const newCoverFilename = req.files['cover'][0].filename;
      const newCoverUrl = getUrlPath(album.title, album._id, newCoverFilename);
      album.cover = newCoverUrl;
    }
    
    // Handle new images upload
    if(req.files && req.files['images']) {
      const newImageUrls = req.files['images'].map(file => {
        const imageUrl = getUrlPath(album.title, album._id, file.filename);
        return imageUrl;
      });
      
      album.images.push(...newImageUrls);
    }
    
    // Save the updated album
    try {
      await album.save();
      res.status(200).json({success: true, data: album});
    } catch (saveError) {
      res.status(500).json({success: false, message: 'Error saving album changes'});
    }
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.params;

  if(!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, message: 'Invalid Album ID'});
  }

  try {
    const album = await Album.findById(id);
    if(!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }

    // Use getAlbumDir helper to get the album folder path
    const albumFolderPath = getAlbumDir(album.title, album._id);

    if(fs.existsSync(albumFolderPath)) {
      try {
        const deletedAlbum = await Album.findByIdAndDelete(id);
        if(!deletedAlbum) {
          return res.status(404).json({success: false, message: 'Album not found in database'});
        }
        
        try {
          fs.rmSync(albumFolderPath, { recursive: true, force: true});
          return res.status(200).json({success: true, message: 'Album deleted successfully'});
        } catch (rmError) {
          return res.status(500).json({success: false, message: 'Error deleting album folder'});
        }
      } catch (dbError) {
        return res.status(500).json({success: false, message: 'Error deleting album from database'});
      }
    } else {
      // If the folder doesn't exist, just delete from database
      try {
        await Album.findByIdAndDelete(id);
        return res.status(200).json({success: true, message: 'Album deleted from database'});
      } catch (dbError) {
        return res.status(500).json({success: false, message: 'Error deleting album from database'});
      }
    }
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbumImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    
    if(!id || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({success: false, message: 'Invalid Album ID'});
    }
    
    const album = await Album.findById(id);
    if(!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
    
    if(!album.images[Number(index)]) {
      return res.status(404).json({success: false, message: 'Image not found'});
    }

    const image = album.images[Number(index)];
    const filename = path.basename(image);
    
    // Use getFotoPath helper to get the full path to the image
    const imagePath = getFotoPath(album.title, album._id, filename);
    
    if(!fs.existsSync(imagePath)) {
      return res.status(404).json({success: false, message: 'Image file not found'});
    }

    res.sendFile(imagePath);
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};