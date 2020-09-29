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
        type: String,
        required: 'Send App Version'       
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    userID: {
        type: String,
        required: 'UserID Required'
    }
});