import express from 'express';
const router = express.Router();
import {getAllRecipes, createRecipe} from '../controllers/recipeController.js';
// Endpoint: GET /api/recipes
router.get('/', getAllRecipes);

// Endpoint: POST /api/recipes
router.post('/', createRecipe);




export default router;
