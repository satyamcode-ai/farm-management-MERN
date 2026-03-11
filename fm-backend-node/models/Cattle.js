import mongoose from 'mongoose';

const cattleSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    tagNumber: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String
    },
    photoUrl: {
        type: String
    },
    // --- Genealogy ---
    sireTagNumber: {
        type: String
    },
    damTagNumber: {
        type: String
    },
    numberOfOffspring: {
        type: Number,
        default: 0
    },
    // --- Lifecycle Tracking ---
    birthDate: {
        type: Date
    },
    breedingDate: {
        type: Date
    },
    breedingCycleStatus: {
        type: String
    },
    lactationPeriod: {
        type: Number
    },
    // Health and AI
    healthStatus: {
        type: String
    },
    breed: {
        type: String
    },
    confidenceScore: {
        type: Number
    }
}, {
    timestamps: true
});

cattleSchema.set('toJSON', {
    virtuals: true,
    transform: (doc, ret) => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
    }
});

const Cattle = mongoose.model('Cattle', cattleSchema);

export default Cattle;
