import express from 'express';
import multer from 'multer';
import { analyzeBreedByFile, studioAnalyzeBreed } from '../controllers/dlController.js';

const router = express.Router();

// Configure multer for memory storage (we just proxy the buffer)
const upload = multer({ storage: multer.memoryStorage() });

// Routes, expecting a field name of 'imageFile'
router.post('/analyze-breed/:cattleId', upload.single('imageFile'), analyzeBreedByFile);
router.post('/studio-analyze', upload.single('imageFile'), studioAnalyzeBreed);

export default router;
