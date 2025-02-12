import express from 'express';
const router = express.Router();
import {getAllRecipes, getRecipe, createRecipe} from '../controllers/recipeController.js';
// Endpoint: GET /api/recipes
router.get('/', getAllRecipes);

// Endpoint: GET /api/recipes/:id
router.get('/:id', getRecipe); 

// Endpoint: POST /api/recipes
router.post('/', createRecipe);

export default router;
