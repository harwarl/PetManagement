import { Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Logging } from '../utils/Logging.js';

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

userSchema.statics.FindByCredentials = async function(email, password, res){
    const user = await User.findOne({ email: email });
    if(!user) return res.status(401).json({status: false, message: "Email not registered"});

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid) return res.status(401).json({status: false, message: "Wrong Password"});

    return user;
}

userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({ id: this._id, email: this.email}, "EatetheCow", {expiresIn: '1h'});
    return token;
}

export const User = model('User', userSchema);