import mongoose from "mongoose";
import Album from "../models/album.model.js";
import path from "path";
import fs from "fs";


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
    const albumId = new mongoose.Types.ObjectId();


    if(!title || !req.files || !req.files['cover'] || !req.files['images']) {
      return res.status(400).json({success: false, message: 'Please provide all Fields'});
    }


    const coverUrl = `/uploads/${title.replace(/\s+/g, '_')}-${albumId}/${req.files['cover'][0].filename}`;
    const imagesUrls = req.files['images'].map((file) => `/uploads/${title.replace(/\s+/g, '_')}-${albumId}/${file.filename}`);

    const newAlbum = new Album({
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
  const { images } = req.body;
  if(!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({success: false, message:'Invalid Album ID'});
  }

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(id, {$push: {images}}, {new: true, runValidators: true});

    if(!updatedAlbum) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }
    res.status(200).json({success: true, data: updatedAlbum});
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
    const deletedAlbum = await Album.findByIdAndDelete(id);
    if(!deletedAlbum) {
      return res.status(404).json({success: false, message: 'Album not found'});
    }

    const albumFolderName = `${deleteAlbum.title.replace(/\s+/g, '_')}-${deleteAlbum._id}`;
    const albumFolderPath = path.join(__dirname, 'uploads', albumFolderName);

    if(fs.existsSync(albumFolderPath)) {
      fs.rmSync(albumFolderPath, {recursive: true, force: true});
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