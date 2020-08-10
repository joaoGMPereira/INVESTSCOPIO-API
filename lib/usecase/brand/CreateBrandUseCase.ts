import * as mongoose from 'mongoose';

import { BrandSchema } from '../../models/brand/BrandModel';

import { Logger } from '../../tools/Logger'

const Tag = mongoose.model('Brand', BrandSchema);

export class CreateBrandUseCase {

    public createBrand(brandModel : typeof BrandSchema, callback) {

        brandModel.save((error, brandModel) => {

            if (error) {
                Logger.log(error, CreateBrandUseCase.name, "createBrand")
                return callback(error, undefined)
            }
            else {
                return callback(undefined, brandModel)
            }
        })
    }
} 