import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { sendEmail } from "../utils/sendEmail.js";
import { Logging } from "../utils/Logging.js";
import { SC } from '../utils/statusCode.js';``
import asyncHandler from 'express-async-handler';
import { User } from '../models/user.js';
import zipcodes from 'zipcodes';
import pkg from 'lodash';
import {
    createSession, updateSession, createAccessToken
} from '../services/session.services.js'
import { createUser, validatePassword } from '../services/user.services.js';
import { signToken } from '../utils/jwt.utils.js';

const { get, omit } = pkg;

export const signUp = asyncHandler(async(req, res, next)=>{
    const {
        username,
        email,
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

    const user = await createUser({...req.body, country: country});
    console.log(user);

    // const user = await User.create({
    //     firstName: firstName,
    //     lastName: lastName, 
    //     username: username,
    //     email: email,
    //     password: password, 
    //     zipCode: zipCode,
    //     country: country
    // })

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
    const user = await validatePassword(req.body);

    if(!user){
        return res.status(401).json({status: false, message: "Invalid email or password"});
    }

    const userAgent = req.get('user-agent');
    const session = await createSession(user, userAgent || "");
    
    const accessToken  = await createAccessToken({user, session});
    const refreshToken = await signToken(session , {expiresIn: '1y'});

    return res.status(200).json({accessToken, refreshToken})
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

export const logout = async(req, res, next)=>{
    //invalidate user session
    const sessionId = get(req, "user.session");

    await updateSession({_id : sessionId}, { valid: false});

    return res.status(200).json({status: true, message: "logged Out"})
}