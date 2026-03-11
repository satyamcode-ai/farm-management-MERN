import express from 'express';
import { getAllRecords, createRecord, deleteRecord } from '../controllers/financeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, getAllRecords);
router.post('/', protect, createRecord);
router.delete('/:id', protect, deleteRecord);

export default router;
