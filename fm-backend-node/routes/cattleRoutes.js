import express from 'express';
import { getAllCattle, getCattleById, createCattle, deleteCattle } from '../controllers/cattleController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllCattle);
router.get('/:id', protect, getCattleById);
router.post('/', protect, createCattle);
router.delete('/:id', protect, deleteCattle);

export default router;
