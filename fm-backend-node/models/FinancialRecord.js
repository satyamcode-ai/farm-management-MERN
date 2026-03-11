import mongoose from 'mongoose';

const financialRecordSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    type: {
        type: String,
        enum: ['INCOME', 'EXPENSE'],
        required: true
    },
    description: {
        type: String
    },
    amount: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});

financialRecordSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const FinancialRecord = mongoose.model('FinancialRecord', financialRecordSchema);

export default FinancialRecord;
