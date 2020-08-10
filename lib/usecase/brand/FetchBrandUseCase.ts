import * as mongoose from 'mongoose';

import { BrandSchema } from '../../models/brand/BrandModel';

const Brand = mongoose.model('Brand', BrandSchema);

export class FetchBrandUseCase {

    async fetch() {
        return await Brand.find().exec()
    }
} 