import express from "express";
import { createProduct, deleteProduct, getProduct, udateProduct } from "../controllers/product.controller.js";

const router = express.Router();

router.get('/', getProduct);
router.post('/', createProduct);
router.put('/:id', udateProduct);
router.delete('/:id', deleteProduct);

export default router;

