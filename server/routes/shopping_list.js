import express from 'express';
const router = express.Router();
import {getShoppingList ,updateShoppingList, resetShoppingList, deleteFromShoppingList} from '../controllers/shopping_listController.js';


router.get('/:userId', getShoppingList);
router.post('/:userId', updateShoppingList);
router.post('/delete/:userId', deleteFromShoppingList);
router.delete('/', resetShoppingList);


export default router;