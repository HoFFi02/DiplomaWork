import express from 'express';
const router = express.Router();
import {getAllRecipes, createRecipe, getRecipeById, updateRecipe, deleteRecipe, getRecipeTest} from '../controllers/recipeController.js';
// Endpoint: GET /api/recipes
router.get('/', getAllRecipes);

// Endpoint: POST /api/recipes
router.post('/', createRecipe);

// Endpoint: GET /api/recipes/:id
router.get('/:id', getRecipeById);

// Endpoint: PUT /api/recipes/:id
router.put('/:id', updateRecipe);

// Endpoint: DELETE /api/recipes/:id
router.delete('/:id', deleteRecipe);
router.get('/:recipeId/ingredients', getRecipeTest);

export default router;
