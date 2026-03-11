import Cattle from '../models/Cattle.js';
import FinancialRecord from '../models/FinancialRecord.js';

// GET /api/dashboard -> Get all key metrics
export const getDashboardSummary = async (req, res) => {
    try {
        const userId = req.user._id;

        // 1. Herd Count & Health Status
        const totalCattle = await Cattle.countDocuments({ userId });

        const healthyCount = await Cattle.countDocuments({ userId, healthStatus: 'Healthy' });
        const sickCount = await Cattle.countDocuments({ userId, healthStatus: 'Sick' });
        const vaccinationDueCount = await Cattle.countDocuments({ userId, healthStatus: 'Vaccination Due' });

        const healthOverview = {
            Healthy: healthyCount,
            Sick: sickCount,
            VaccinationDue: vaccinationDueCount
        };

        // 2. Financial Summary
        const incomeRecords = await FinancialRecord.find({ userId, type: 'INCOME' });
        const expenseRecords = await FinancialRecord.find({ userId, type: 'EXPENSE' });

        const totalIncome = incomeRecords.reduce((sum, record) => sum + record.amount, 0);
        const totalExpense = expenseRecords.reduce((sum, record) => sum + record.amount, 0);
        const quickProfitLoss = totalIncome - totalExpense;

        res.json({
            totalHerdCount: totalCattle,
            healthOverview: healthOverview,
            totalIncome: totalIncome,
            totalExpense: totalExpense,
            quickProfitLoss: quickProfitLoss
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
