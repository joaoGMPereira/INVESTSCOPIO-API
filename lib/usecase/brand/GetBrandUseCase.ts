import * as mongoose from 'mongoose';

import { BrandSchema } from '../../models/brand/BrandModel';

const Brand = mongoose.model('Brand', BrandSchema);

export class GetBrandUseCase {

     async get(id) {
        return await Brand.findOne({ _id: id }).exec()
    }
} 