
import express from 'express';
import {param } from 'express-validator';
const router = express.Router();
import { getShoppingList, updateShoppingList, deleteFromShoppingList } from '../controllers/shopping_listController.js';
import { isAuthenticated, isAuthorized } from '../middleware/auth.js';

const validateUserId = param('userId').isInt().withMessage('Invalid userId');


router.get('/:userId', isAuthenticated, validateUserId, isAuthorized, getShoppingList);
router.post('/:userId', isAuthenticated, validateUserId, isAuthorized, updateShoppingList);
router.post('/delete/:userId', isAuthenticated, validateUserId, isAuthorized, deleteFromShoppingList);


export default router;
