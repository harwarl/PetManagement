import { model, Schema } from 'mongoose';

const sessionSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    valid: {
        type: Boolean,
        default: true
    },
    userAgent: {
        type: String
    }
}, { timestamps: true})

const Session = model('Session', sessionSchema);

export { Session }