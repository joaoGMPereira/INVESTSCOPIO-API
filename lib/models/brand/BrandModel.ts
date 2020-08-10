import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const BrandSchema = new Schema({

    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    }

}, { usePushEach: true });