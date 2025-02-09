import express from "express";
import { deletePhoto, getPhoto, uploadPhoto } from "../controllers/photo.controller.js";
import upload, { uploadMiddleware } from "./upload.router.js";

const router = express.Router();

router.get('/:id', getPhoto);
router.post('/:albumId', upload.single("image"), uploadMiddleware, uploadPhoto);
router.delete('/:albumId/:id', deletePhoto);

export { router as photoRoutes};