import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cattleRoutes from './routes/cattleRoutes.js';
import financeRoutes from './routes/financeRoutes.js';
import dlRoutes from './routes/dlRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json()); // Body parser replaces Spring Boot's automatic JSON parsing

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/farm-management')
    .then(() => console.log('✅ MongoDB Connected Successfully'))
    .catch((err) => console.error('❌ MongoDB Connection Error:', err));

// Routes
app.use('/api/livestock', cattleRoutes);
app.use('/api/finance', financeRoutes);
app.use('/api/dl', dlRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/', (req, res) => {
    res.send('Farm Management System API is running');
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
