import express from "express";
import { createPhoto, deletePhoto, getPhoto, updatePhoto } from "../controllers/photo.controller.js";

const router = express.Router();

router.get('/', getPhoto);
router.post('/', createPhoto);
router.put('/:id', updatePhoto);
router.delete('/:id', deletePhoto);

export default router;