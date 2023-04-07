import { model, Schema } from 'mongoose';

const shelterSchema  =new Schema({
    name: { type: String, unique: true, required: true },
    pets: [{
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    }],
    zipCode: { type: Number, required: true },
    pictures: [{
        name: {type: String},
        url: { type: String },
    }],
    phone: { type: Number, required: true},
    city: { type: String, required: true},
    state: { type: String, required: true},
    country: { type: String, require: true}
})

export const Shelter = model('Shelter', shelterSchema);