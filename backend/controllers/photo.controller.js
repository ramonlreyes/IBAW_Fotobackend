import mongoose from "mongoose";
import Album from "../models/album.model.js";
import Photo from "../models/photo.model.js";


export const getPhoto = async (req, res) => {
  const { albumId } = req.params;
  try {
    const photos = await Photo.find({ albumId });
    res.status(200).json({success: true, data: photos});
  } catch (error) {
    console.log('error in fetching photos:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const uploadPhoto = async (req, res) => {
  const { albumId } = req.params;

  const album = await Album.findById(albumId);
  if(!album){
    return res.status(404).json({success: false, message: 'Album not found'});
  }

  if(!req.file) {
    return res.status(400).json({success: false, message: 'No file uploaded'});
  }

  const imageData = {
    data: req.file.buffer,
    contentType: req.file.mimetype
  }

  try {
    const newPhoto = new Photo({
      albumId,
      image: imageData
    });

    await newPhoto.save();
    album.images.push(imageData);
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

  const photo = await Photo.findById(id);
  if(!photo) {
    return res.status(404).json({success: false, message: 'Photo not found'});
  }

  album.images = album.images.filter(image => image._id.toString() !== photoId);
  
  try {
    await album.save();
    await Photo.findByIdAndDelete(id);
    res.status(200).json({success: true, message: 'Photo deleted'});
  } catch (error) {
    console.log('error in deleting Photo:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getPhotoImage = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(id);
  if(!photo) {
    return res.status(404).json({success: false, message: 'Photo not found'});
  }
  res.set('Content-Type', photo.image.contentType);
  res.send(photo.image.data);
};