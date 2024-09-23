import express from 'express';
const router = express.Router();
import {updateDay, deleteDay, getUserDays} from '../controllers/dayController.js';
// Endpoint: GET /api/days
router.get('/', getUserDays);

// Endpoint: PUT /api/days/:id
router.put('/:id', updateDay);

// Endpoint: DELETE /api/days/:id
router.put('/delete/:id', deleteDay);

export default router;
