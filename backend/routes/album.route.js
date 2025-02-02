import express from "express";
import { createAlbum, deleteAlbum, getAllAlbums, getAlbum, updateAlbum } from "../controllers/album.controller.js";
import upload from "./upload.router.js";

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:albumId', getAlbum);
router.post('/', upload.array("images"), createAlbum);
router.put('/:id', upload.array("images"), updateAlbum);
router.delete('/:id', deleteAlbum);

export { router as albumRoutes};

