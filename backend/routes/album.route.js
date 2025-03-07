import express from "express";
import { createAlbum, deleteAlbum, getAllAlbums, getAlbum, updateAlbum, getAlbumImage } from "../controllers/album.controller.js";
import upload, { uploadMiddleware } from "./upload.router.js";

const router = express.Router();

//Albums

router.get('/', getAllAlbums);
router.get('/:albumId', getAlbum);
router.post('/', uploadMiddleware, createAlbum);
router.get('/:id/images/:index', getAlbumImage);
router.put('/:id', uploadMiddleware, updateAlbum);
router.delete('/:id', deleteAlbum);

/*
//Photos

router.get('/:id', getPhoto);
router.get('/:albumId', getAllPhotos);
router.post('/:albumId', uploadMiddleware, uploadPhoto);
router.delete('/:albumId/:id', deletePhoto);

*/

export { router as albumRoutes};

