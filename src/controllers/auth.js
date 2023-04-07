import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/sendEmail.js";
import { Logging } from "../utils/Logging.js";
import { SC } from '../utils/statusCode.js';``
import asyncHandler from 'express-async-handler';
import { User } from '../models/user.js';
import zipcodes from 'zipcodes';

export const signUp = asyncHandler(async(req, res, next)=>{
    const {
        firstName,
        lastName, 
        username,
        email,
        password, 
        zipCode
    } = req.body;

    Logging.info('It works');
    const check_email = await User.findOne({email: email});
    if(check_email){
        return res.status(SC.BadRequest).json({status: false, message: "Email already registered"});
    }
    const check_username = await User.findOne({username: username});
    if(check_username){
        return res.status(SC.BadRequest).json({status: false, message: "Username already in use"});
    }
    
    const zipcode = zipcodes.lookup(Number(zipCode));
    if(!zipcode){
        return res.status(SC.BadRequest).json({status: false, message: "Wrong ZipCode"});
    }

    const country = zipcode.country;

    const user = await User.create({
        firstName: firstName,
        lastName: lastName, 
        username: username,
        email: email,
        password: password, 
        zipCode: zipCode,
        country: country
    })

    const emailToken = jwt.sign({email: user.email, id: user._id}, 'emailTokenSecret', { expiresIn: '20m'});

    sendEmail({
        email: user.email,
        subject: "Verify Your Email",
        message: `<p>Thanks for Signing up </p>
        <p>Use this <a href='${req.protocol}://${req.get("host")}/api/auth/verify/${emailToken}'> Link </a> to verify your email</p>
        <p>Link expires in 1 minutes</p>`
    })

    if(user){
        return res.status(SC.Created).json({status: true, message: 'User Registered', data: user});
    }
    return res.status(SC.InternalSE).json({status: false, message: 'Server Error'});


    
})

export const login = asyncHandler(async(req, res, next)=>{ 
    const { 
        email, 
        password 
    } = req.body;

    const user_exists = await User.FindByCredentials(email, password, res);
    if(user_exists){
        const token = user_exists.generateAuthToken();
        res.cookie('jwt-token', token, {httpOnly: true, maxAge: 24 * 60 * 60});
        res.setHeader('Authorization', `Bearer ${token}`);
        return res.status(200).json({status: true, message: 'Logged In', data: user_exists});
    }



})

export const verifyEmail = asyncHandler(async(req, res, next)=>{
    const { emailToken } = req.params;

    jwt.verify(emailToken, 'emailTokenSecret', async(err, decoded)=>{
        if(err){
            if(err.message.toString().includes('expire')){
                return res.status(SC.UnAuthorized).json({status: false, message: err.message})
            }
        }
        if(!decoded){
            return res.status(SC.UnAuthorized).json({status: false, message: 'Invalid Token'})
        }

        const user = await User.findOne({_id: decoded.id, email: decoded.email});
        if(user.verified){
            return res.status(SC.BadRequest).json({status: false, message: 'Email already verified'})
        }
        await User.findOneAndUpdate({_id: decoded.id, email: decoded.email}, {
            verified: true
        }, { new: true})
        return res.status(SC.Accepted).json({status: true, message: 'Email Verified, Please login'});

    })



})

export const resetPassword = (req, res, next)=>{

}

export const forgotPassword = (req, res, next) =>{

}

export const logout = (req, res, next)=>{
    res.clearCookie('jwt-token');
    res.setHeader['Authorization', ``];
    return res.status(SC.Accepted).json({status: true, message: 'logout Successful'})
}