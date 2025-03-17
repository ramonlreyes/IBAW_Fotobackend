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


export { router as albumRoutes};

