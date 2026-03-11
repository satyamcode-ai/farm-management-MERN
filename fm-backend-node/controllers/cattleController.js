import Cattle from '../models/Cattle.js';

// GET /api/livestock -> Get all cattle
export const getAllCattle = async (req, res) => {
    try {
        const cattle = await Cattle.find({ userId: req.user._id });
        res.json(cattle);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// GET /api/livestock/:id -> Get single cattle profile
export const getCattleById = async (req, res) => {
    try {
        const cattle = await Cattle.findOne({ _id: req.params.id, userId: req.user._id });
        if (cattle) {
            res.json(cattle);
        } else {
            res.status(404).json({ message: 'Cattle not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/livestock -> Add new cattle
export const createCattle = async (req, res) => {
    try {
        const cattle = new Cattle({
            ...req.body,
            userId: req.user._id
        });
        const savedCattle = await cattle.save();
        res.status(201).json(savedCattle);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /api/livestock/:id -> Delete cattle
export const deleteCattle = async (req, res) => {
    try {
        const cattle = await Cattle.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (cattle) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Cattle not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
