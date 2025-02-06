import express from "express";
import { deletePhoto, getPhoto, uploadPhoto } from "../controllers/photo.controller.js";
import upload from "./upload.router.js";

const router = express.Router();

router.get('/', getPhoto);
router.post('/:albumId', upload.single("image"), uploadPhoto);
router.delete('/:albumId/:id', deletePhoto);

export { router as photoRoutes};