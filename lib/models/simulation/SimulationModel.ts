import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const SimulationSchema = new Schema({
    initialValue: {
        type: Number,
        required: true
    },
    monthValue: {
        type: Number,
        required: false,
        default: 0
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
        required: false,
        default: 0
    },
    increaseRescue: {
        type: Number,
        required: false,
        default: 0
    },
    goalIncreaseRescue: {
        type: Number,
        required: false,
        default: 0
    },
    isSimply: {
        type: Boolean,
        required: true
    },
    userID: {
        type: String,
        required: true
    },
    created: {
        type: Date,
        default: Date.now
    }

}, { usePushEach: true });