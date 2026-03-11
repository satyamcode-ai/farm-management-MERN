import axios from 'axios';
import FormData from 'form-data';
import Cattle from '../models/Cattle.js';
import dotenv from 'dotenv';
dotenv.config();

const dlStudioServiceUrl = process.env.DL_STUDIO_URL || 'http://localhost:5000/studio-analyze';

// --- 1. Endpoint for Livestock Management (Takes File, Updates DB) ---
export const analyzeBreedByFile = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Image file is empty.');
        }

        const cattleId = req.params.cattleId;

        // Build the multipart request to send to the Python service
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        // 1. Send the file to the external DL Python service
        const response = await axios.post(dlStudioServiceUrl, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        const dlResult = response.data;
        if (!dlResult) {
            return res.status(500).send('DL Service returned an empty response.');
        }

        // 2. Update Local Cattle Record
        const cattle = await Cattle.findById(cattleId);
        if (!cattle) {
            return res.status(404).json({ message: 'Cattle not found' });
        }

        cattle.breed = dlResult.breed;
        cattle.confidenceScore = dlResult.confidence;
        await cattle.save();

        res.json(cattle);

    } catch (error) {
        res.status(500).json({ message: `DL Service proxy failed: ${error.message}` });
    }
};

// --- 2. Endpoint for DL Model Studio (Takes File, Returns Result) ---
export const studioAnalyzeBreed = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('Image file is empty.');
        }

        // Build the multipart request to send to the Python service
        const formData = new FormData();
        formData.append('file', req.file.buffer, req.file.originalname);

        const response = await axios.post(dlStudioServiceUrl, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        res.json(response.data);

    } catch (error) {
        res.status(500).json({ message: `DL Service proxy failed: ${error.message}` });
    }
};
