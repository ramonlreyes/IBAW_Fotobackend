import mongoose from "mongoose";
import Photo from "../models/photo.model.js";


export const getPhoto = async (req, res) => {
  const albumId = req.params.albumId;
  try {
    const photos = await Photo.find({albumId},{});
    res.status(200).json({success: true, data: photos});
  } catch (error) {
    console.log('error in fetching photos:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const createPhoto = async (req, res) => {
  const photo = req.body; // user will send this data

  if(!photo.image) {
    return res.status(404).json({success: false, message: 'Please provide all fields'});
  }

  const newPhoto = new Photo(photo);
  try {
    await newPhoto.save();
    res.status(201).json({success: true, data: newPhoto});
  } catch (error) {
    console.log('Error in Create Photo:', error.message)
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const photo = req.body;


  if(!id || !mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: 'Invalid Album Id'});
  }

  try {
    const updatedPhoto = await Photo.findByIdAndUpdate(id, photo, {new:true});
    res.status(200).json({success: true, data: updatedPhoto});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const deletePhoto = async (req, res) => {
  const {id} = req.params;

  if(!id || !mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: 'Invalid Product Id'});
  }
  
  try {
    await Photo.findByIdAndDelete(id);
    res.status(200).json({success: true, message: 'Photo deleted'});
  } catch (error) {
    console.log('error in deleting Photo:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};