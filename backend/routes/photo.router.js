import express from "express";
import { createPhoto, deletePhoto, getPhoto, updatePhoto } from "../controllers/photo.controller.js";
import upload from "./upload.router.js";

const router = express.Router();

router.get('/', getPhoto);
router.post('/', upload.single("image"), createPhoto);
router.put('/:id', upload.single("image"), updatePhoto);
router.delete('/:id', deletePhoto);

export { router as photoRoutes};