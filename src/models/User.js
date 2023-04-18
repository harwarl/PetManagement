import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true
    },

    lastName: {
        type: String,
        required: true
    },

    username: {
        type: String, 
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },

    zipCode: {
        type: Number,
        required: true
    },
    
    isAdmin: {
        type: Boolean,
        default: true
    },

    verified: {
        type: Boolean,
        default: false
    },

    country: {
        type: String
    },

    likedPet: [{
        type: Schema.Types.ObjectId,
        ref: 'Pet'
    }],

    adoptedPet: [{
        type : Schema.Types.ObjectId,
        ref: 'Pet'
    }]
    
})


userSchema.pre('save', async function(next){
    if(this.isModified()){
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.methods.comparePassword = async function(password){
    const user = this;
    return bcrypt.compare(password, user.password).catch((e)=> {return false});
}

export const User = model('User', userSchema);