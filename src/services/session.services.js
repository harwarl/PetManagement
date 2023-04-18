import { Session } from "../models/Session.model.js";
import { decode, signToken } from "../utils/jwt.utils.js";
import { findUser } from "./user.services.js";
import pkg from 'lodash';

const { get, pick } = pkg;

export async function createSession(userId, userAgent){
    const session = await Session.create({user: userId, userAgent});
    return session.toJSON();
}

export async function createAccessToken({user, session}){
    const userIm = pick(user, ['_id', 'email', 'isAdmin']);
    const accessToken = signToken({...userIm, session: session._id}, { expiresIn: "15m"} )
    return accessToken
}

export async function updateSession(query, update){
    const session = await Session.updateOne(query, update); 
    console.log({ session })
    return session;
}

export async function reIssueAccessToken({ refreshToken }){
    //decode refreshToken
    const { decoded } = await decode(refreshToken);

    //if token is not valid or has expired
    if(!decoded || !get(decoded, "_id")) return false

    //get the session
    const session = await Session.findOne({_id: get(decoded, "_id")});

    //checking if session is valid
    if(!session && !session?.valid) return false

    const user = await findUser({_id: session.user});
    if(!user) return false

    const accessToken = createAccessToken({ user, session });
    console.log({ accessToken })

    return accessToken;
}