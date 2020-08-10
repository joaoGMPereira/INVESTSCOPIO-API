import * as mongoose from 'mongoose';

import { BrandSchema } from '../../models/brand/BrandModel';
import { HTTPStatus } from '../../models/http/HTTPStatus';

const Brand = mongoose.model('Brand', BrandSchema);

export class DeleteBrandUseCase {

    public delete(id: String, callback) {

        Brand.remove({ _id: id }, (error, model) => {
            if (error) {
                callback(error, new HTTPStatus.CLIENT_ERROR)
            }
            else {
                callback(undefined, model)
            }
        });
    }
} 