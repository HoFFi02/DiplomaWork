import express from 'express';
const router = express.Router();
import {getAllDays, createDay, getDayById, updateDay, deleteDay, getDayTest, getUserDays} from '../controllers/dayController.js';
// Endpoint: GET /api/days
router.get('/', getUserDays);

// Endpoint: POST /api/days
router.post('/', createDay);

// Endpoint: GET /api/days/:id
router.get('/:id', getDayById);

// Endpoint: PUT /api/days/:id
router.put('/:id', updateDay);

// Endpoint: DELETE /api/days/:id
router.delete('/:id', deleteDay);
router.get('/:dayId/meals', getDayTest);

export default router;
