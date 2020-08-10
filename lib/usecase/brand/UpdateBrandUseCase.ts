import * as mongoose from 'mongoose';

import { BrandSchema } from '../../models/brand/BrandModel';
import { HTTPStatus } from '../../models/http/HTTPStatus';

const Brand = mongoose.model('Brand', BrandSchema);

export class UpdateBrandUseCase {

    public update(addressModel: typeof BrandSchema, callback) {

        Brand.findOneAndUpdate({ _id: addressModel._id }, addressModel, { new: true }, (error, model) => {
            if (error) {
                return callback(error, new HTTPStatus.CLIENT_ERROR.BAD_REQUEST);
            }
            else {
                return callback(undefined, model);
            }
        });
    }
} 