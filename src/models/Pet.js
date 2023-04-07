import { model, Schema } from 'mongoose';

const petsSchema = new Schema({
    name : { type: String, required: true },
    breed : { type: String, required: true },
    age : { type: Number, required: true },
    size : { type: String, enum: ['small', 'medium', 'large', 'extraLarge'], required: true},
    gender : { type: String, required: true},
    color: { type: String, required: true},
    coatLength: { type: String, required: true, enum: ['short', 'medium', 'long']},
    adopted : { type: Boolean, dafault: false},
    energyLevel : { type: String, enum: ['low', 'medium', 'high'] },
    friendliness : { type: Boolean },
    easeOfTraining : { type: String, enum: ['easy', 'average', 'difficult'] },
    exerciseRequirement: { type: String, enum: ['M', 'S', 'R']},
    affectionNeeds: { type: String, enum: ['independent', 'balanced', 'cuddly'] },
    pictures: [{
        name: {type: String},
        url: {type: String},
        description: {type: String}
    }],
    shelter: {
        type: Schema.Types.ObjectId,
        ref: 'Shelter',
    },
    adoptedDate: {
        type: Date
    }
}, {timestamps: true})

export const Pet = model('Pet', petsSchema);