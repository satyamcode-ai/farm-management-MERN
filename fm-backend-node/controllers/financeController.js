import FinancialRecord from '../models/FinancialRecord.js';

// GET /api/finance -> Get all financial records
export const getAllRecords = async (req, res) => {
    try {
        const records = await FinancialRecord.find({ userId: req.user._id }).sort({ date: -1 }); // Returning sorted by date is a good practice
        res.json(records);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// POST /api/finance -> Add a new expense or income record
export const createRecord = async (req, res) => {
    try {
        const record = new FinancialRecord({
            ...req.body,
            userId: req.user._id
        });
        const savedRecord = await record.save();
        res.status(201).json(savedRecord);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// DELETE /api/finance/:id -> Delete a financial record
export const deleteRecord = async (req, res) => {
    try {
        const record = await FinancialRecord.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
        if (record) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
