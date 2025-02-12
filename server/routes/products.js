import express from 'express';
const router = express.Router();
import {getAllProducts} from '../controllers/productController.js';
// Endpoint: GET /api/product
router.get('/', getAllProducts);

export default router;
