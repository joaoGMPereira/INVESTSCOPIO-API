import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SimulationSchema = new Schema({

    initialValue: {
        type: Number,
        required: true
    },
    monthValue: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    totalMonths: {
        type: Number,
        required: true
    },
    initialMonthlyRescue: {
        type: Number,
        required: false
    },
    increaseRescue: {
        type: Number,
        required: false
    },
    goalIncreaseRescue: {
        type: Number,
        required: false
    },
    isSimply: {
        type: Boolean,
        required: true
    },
    userID: {
        type: String,
        required: true
    }

}, { usePushEach: true });