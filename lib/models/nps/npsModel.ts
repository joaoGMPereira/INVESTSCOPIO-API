//   /lib/models/crmModel.ts
import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const NPSSchema = new Schema({
    rate: {
        type: Number,
        required: 'Send an evaluation'
    },
    versionSO: {
        type: String,
        required: 'Send SO Version'
    },
    versionApp: {
        type: Number,
        required: 'Send App Version'       
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: 'UserID Required'
    }
});