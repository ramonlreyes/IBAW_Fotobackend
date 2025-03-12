import express from "express";
import { createAlbum, deleteAlbum, getAllAlbums, getAlbum, updateAlbum, getAlbumImage } from "../controllers/album.controller.js";
import upload, { uploadMiddleware } from "./upload.router.js";
import { protect, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

//Albums

router.get('/', getAllAlbums);
router.get('/:albumId', getAlbum);
router.post('/', protect, isAdmin, uploadMiddleware, createAlbum);
router.get('/:id/images/:index', getAlbumImage);
router.put('/:id', protect, isAdmin, uploadMiddleware, updateAlbum);
router.delete('/:id', protect, isAdmin, deleteAlbum);

/*
//Photos

router.get('/:id', getPhoto);
router.get('/:albumId', getAllPhotos);
router.post('/:albumId', uploadMiddleware, uploadPhoto);
router.delete('/:albumId/:id', deletePhoto);

*/

export { router as albumRoutes};

