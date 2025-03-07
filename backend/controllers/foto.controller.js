import mongoose from "mongoose";
import path from "path";
import fs from "fs";
import Album from "../models/album.model.js";
import Fotos from "../models/foto.model.js";


export const getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({});
    res.status(200).json({success: true, data: photos});
  } catch (error) {
    console.log('Error in fetching photos;', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getPhoto = async (req, res) => {
  const { albumId, photoId } = req.params;
  try {
    if(photoId) {
      const photo = await Photo.findById(photoId);
      if(!photo) {
        return res.status(404).json({success: false, message: 'Photo not found'});
      }
      return res.statu(200).json({success: true, data: photo});
    }

    const photos = await Photo.find({ albumId });
    res.status(200).json({success: true, data: photos});
  } catch (error) {
    console.log('error in fetching photos:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const uploadPhoto = async (req, res) => {
  const { albumId } = req.params;
  const { __dirname } = req.params;

  try {
    const album = await Album.findById(albumId);
    if(!album){
      return res.status(404).json({success: false, message: 'Album not found'});
    }

    if(!req.files['images']) {
      return res.status(400).json({success: false, message: 'No file uploaded'});
    }

    const uploadFolder = path.join(__dirname, "..", "..", "uploads", `${album.title.replace(/\s+/g, "_")}-${albumId}`);

    if (!fs.existsSync(uploadFolder)) {
      fs.mkdirSync(uploadFolder, { recursive: true });
    }

   
    const imagesUrls = req.files["images"].map((file) => `/uploads/${album.title.replace(/\s+/g, "_")}-${albumId}/${file.filename}`);

  

    const newPhoto = new Photo({
      albumId,
      images: imagesUrls,
    });

    await newPhoto.save();

    album.images.push(...newPhoto.images);
    await album.save();


    res.status(201).json({success: true, data: newPhoto});
  } catch (error) {
    console.log('Error in creating Photo', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};


export const deletePhoto = async (req, res) => {
  const { albumId, photoId } = req.params;

  const album = await Album.findById(albumId);
  if(!album) {
    return res.status(404).json({success: false, message: 'Album not found'});
  }

  const photo = await Photo.findById(photoId);
  if(!photo) {
    return res.status(404).json({success: false, message: 'Photo not found'});
  }

  album.images = album.images.filter(image => image.toString() !== photo.imageUrl);
  
  try {
    await album.save();
    await Photo.findByIdAndDelete(photoId);

    const albumFolderName = `${album.title.replace(/\s+/g, '_')}-${albumId}`;
    const albumFolderPath = path.join(__dirname, 'uploads', albumFolderName);
    const photoFilePath = path.join(albumFolderPath, path.basename(photo.imageUrl));

    if(fs.existsSync(photoFilePath)) {
      fs.unlinkSync(photoFilePath);
    }

    res.status(200).json({success: true, message: 'Photo deleted'});
  } catch (error) {
    console.log('error in deleting Photo:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getPhotoImage = async (req, res) => {
  const { id } = req.params;
  const albumId = req.params.albumId;
  try {
    const photo = await Photo.findById(id);
    if(!photo) {
      return res.status(404).json({success: false, message: 'Photo not found'});
  }

  const album = await Photo.findById(albumId);
  if (!album) {
    return res.status(404).json({success: false, message: 'Album not found'});
  }


  const imagePath = path.join(__dirname, 'uploads', albumFolderName, path.basename(photo.imageUrl));

  
  res.sendFile(imagePath);

  } catch (error) {
    console.log('Error in fetching photo image', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }

};