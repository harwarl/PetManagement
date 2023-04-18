import { User } from "../models/user.js";
import pkg from 'lodash';
import bcrypt from "bcrypt";

const { omit } = pkg;
export async function findUser(query){
    const user = await User.findOne(query);
    return user;
}

export async function createUser(input){
    try{
        const user = await User.create(input);
    }catch(e){
        throw new Error(e);
    }
}

export async function validatePassword({ email, password }){
    const user = await User.findOne({email: email});
    if(!user){
        return false;
    }
    const isValid = user.comparePassword(password);
    if(!isValid){
        return false
    }
    return (omit(user, "password"));
}

