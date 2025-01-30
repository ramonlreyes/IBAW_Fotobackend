import express from "express";
import { createAlbum, deleteAlbum, getAllAlbums, getAlbum, updateAlbum } from "../controllers/album.controller.js";

const router = express.Router();

router.get('/', getAllAlbums);
router.get('/:albumId', getAlbum);
router.post('/', createAlbum);
router.put('/:id', updateAlbum);
router.delete('/:id', deleteAlbum);

export default router;

