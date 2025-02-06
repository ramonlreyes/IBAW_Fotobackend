import mongoose from "mongoose";
import Album from "../models/album.model.js";


export const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    res.status(200).json({success: true, data: albums});
  } catch (error) {
    console.log('error in fetching albums:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbum = async (req, res) => {
  const { id } = req.params;
  const album = req.body;

  try {
    const album = await Album.find(id, {});
    res.status(200).json({success: true, data: albums});
  } catch (error) {
    console.log('error in fetching album:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const createAlbum = async (req, res) => {
  try {
    const { title} = req.body;

    if(!req.files ||!req.length === 0 || !title ) {
      return res.status(404).json({success: false, message: 'Please provide all fields'});
    }

    const images = req.files.map((file) => ({
      data: file.buffer,
      contentType: file.mimetype,
    }));

    const newAlbum = new Album({title, images});

    await newAlbum.save();
    res.status(201).json({success: true, data: newAlbum});
  
  } catch (error) {
    console.log('Error in Create Album:', error.message)
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const updateAlbum = async (req, res) => {
  const { id } = req.params;
  const album = req.body;


  if(!id || !mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: 'Invalid Album Id'});
  }

  try {
    const updatedAlbum = await Album.findByIdAndUpdate(id, album, {new:true});
    res.status(200).json({success: true, data: updatedAlbum});
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const deleteAlbum = async (req, res) => {
  const {id} = req.params;

  if(!id || !mongoose.Types.ObjectId.isValid(id)){
    return res.status(404).json({success: false, message: 'Invalid Product Id'});
  }
  
  try {
    await Album.findByIdAndDelete(id);
    res.status(200).json({success: true, message: 'Album deleted'});
  } catch (error) {
    console.log('error in deleting Album:', error.message);
    res.status(500).json({success: false, message: 'Server Error'});
  }
};

export const getAlbumImage = async (req, res) => {
  try {
    const { id, index} = req.params;
    const album = await Album.findById(id);

    if(!album || !album.images[Number(index)]) {
      return res.status(404).json({success: false, message: "image not found"});
    }
    res.set('Content-type', album.images[Number(index)].contentType);
    res.send(album.images[Number(index)].data);
  } catch (error) {
    console.log("Error in fetching image:", error.message);
    res.status(500).json({success: false, message: "Server Error"});
  }
};