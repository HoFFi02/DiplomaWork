import express from 'express';
const router = express.Router();
import {updateDay, deleteDay, getUserDays} from '../controllers/dayController.js';
import { isAuthenticated, isAuthorized } from '../middleware/auth.js';

import { param, body } from 'express-validator'; 

const validateUserId = param('userId').isInt().withMessage('Invalid userId');

// Endpoint: GET /api/days
router.get('/:userId', isAuthenticated, validateUserId, isAuthorized, getUserDays);
// Endpoint: PUT /api/days/:id
router.put('/:userId', isAuthenticated, validateUserId, isAuthorized, updateDay);
// Endpoint: DELETE /api/days/:id
router.put('/delete/:userId', isAuthenticated, validateUserId, isAuthorized, deleteDay);


export default router;
