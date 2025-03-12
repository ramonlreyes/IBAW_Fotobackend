import mongoose from "mongoose";
import Album from "../models/album.model.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname } from "path";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    res.status(200).json({success: true, data: albums});
  } catch (error) {
    console.log('Error in fetching albums;', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbum = async (req, res) => {
  const { id } = req.params;

  try {
    const album = await Album.findById(id);
    if (!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
    res.status(200).json({success: true, data: album});
  } catch (error) {
    console.log('Error ind fetching album:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title } = req.body;
    const albumId =  req.albumId || new mongoose.Types.ObjectId();


    if(!title || !req.files || !req.files['cover'] || !req.files['images']) {
      return res.status(400).json({success: false, message: 'Please provide all Fields'});
    }

    const albumFolderName = `${title.replace(/\s+/g, '_')}-${albumId}`;
    const coverUrl = `/uploads/${albumFolderName}/${req.files['cover'][0].filename}`;
    const imagesUrls = req.files['images'].map((file) => `/uploads/${albumFolderName}/${file.filename}`);

    const newAlbum = new Album({
      _id: albumId,
      title,
      cover: coverUrl,
      images: imagesUrls
    });

    await newAlbum.save();

    res.status(201).json({success: true, albumId: newAlbum._id, data: newAlbum});
  } catch (error) {
    console.log('Error in Creating a Album:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const updateAlbum = async (req, res) => {
  const { id } = req.params;

  if(!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, message:'Invalid Album ID'});
  }

  try {
    const album = await Album.findById(id);
    if(!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
    
    const oldAlbumFolderName = `${album.title.replace(/\s+/g, '_')}-${album._id}`;
    const oldAlbumFolderPath = path.join(__dirname, '..', '..', 'uploads', oldAlbumFolderName);

    let newAlbumFolderName = oldAlbumFolderName;
    let newAlbumFolderPath = oldAlbumFolderPath;

    if(req.body.title && req.body.title !== album.title) {
      newAlbumFolderName = `${req.body.title.replace(/\s+/g, '_')}-${album._id}`;
      newAlbumFolderPath = path.join(__dirname,'..','..', 'uploads', newAlbumFolderName);

      if(fs.existsSync(oldAlbumFolderPath)) {
        fs.renameSync(oldAlbumFolderPath, newAlbumFolderPath);
      }

      album.title = req.body.title;
    }

    if(req.files && req.files['cover']) {
      if(album.cover){
        const oldCoverPath = path.join(__dirname,'..', '..', 'uploads', album.cover.split('/')[2], album.cover.split('/')[3]
      );
        await fs.promises.rm(oldCoverPath, {force: true});
      }
      const newCoverFilename = req.files['cover'][0].filename;
      const newCoverUrl = `/uploads/${req.albumFolderName}/${newCoverFilename}`;
      album.cover = newCoverUrl;
    }

    if(req.files && req.files['images']) {
      const imagesUrls = req.files['images'].map((file) => `/uploads/${req.albumFolderName}/${file.filename}`);
      album.images.push(...imagesUrls);
    }

    await album.save();
    
    res.status(200).json({success: true, data: album});
  } catch (error) {
    console.error(error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const deleteAlbum = async (req, res) => {
  const { id } = req.params;

  if(!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, message: 'Invalid Album ID'});
  }

  try{
    const album = await Album.findById(id);
    if(!album) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }

    const albumFolderName = `${album.title.replace(/\s+/g, '_')}-${album._id}`;
    const albumFolderPath = path.join(__dirname,'..', '..','uploads', albumFolderName);

    if(fs.existsSync(albumFolderPath)) {
      try {
        const deletedAlbum = await Album.findByIdAndDelete(id);
        if(!deletedAlbum) {
          return res.status(404).json({ success: false, message: 'Album not found in database'});
        };
        
        fs.rmSync(albumFolderPath, { recursive: true, force: true});
        return res.status(200).json({success: true, message: `Successfully deleted Folder: ${albumFolderPath}`});

      } catch (folderError) {
        return res.status(500).json({success: false, message: 'Failed to delete Album'});
      }
    } else {
      console.log(`Album folder not found ${albumFolderPath}`);
    }

    res.status(200).json({success: true, message: 'Album deleted'});
  } catch (error) {
    console.log('Error in deleting Album:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbumImage = async (req, res) => {
  try {
    const { id, index } = req.params;
    const album = await Album.findById(id);

    if(!album || !album.images[Number(index)]) {
      return res.status(404).json({success: false, message: 'Image not fund'});
    }

    const image = album.images[Number(index)];
    const imagePath = (path.join(__dirname, 'uploads', image));

    res.sendFile(imagePath);

  } catch (error) {
    console.log('Error in fetchin Image:', error.message);
    res.status(500).json({success: false, messsage: 'Server Error'});
  }
};