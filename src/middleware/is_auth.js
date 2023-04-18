import pkg from 'lodash';
import { decode } from '../utils/jwt.utils.js';
import { reIssueAccessToken } from '../services/session.services.js';

const { get, omit } = pkg;

export async function is_auth(req, res, next){
    //get access Token
    if(!req.get('authorization')){
        console.log('Authorizationn header not present')
    }
    
    const accessToken = get(req, 'headers.authorization').replace(
        /^Bearer\s/,
        ""
    )

    //get Refresh Token
    const refreshToken = get(req, 'headers.x-refresh');
    if(!accessToken){
        return res.sendStatus(403);
    }

    const { decoded, expired } = await decode(accessToken);
    //get user details from decoded token
    if(decoded){
        req.user = decoded;
        req.admin = req.user.isAdmin;
        next();
    }

    //if token has expired and refreshToken exists
    if(expired && refreshToken){
        const newAccessToken = await reIssueAccessToken({ refreshToken });
        console.log({newAccessToken})
        if(newAccessToken){
            res.setHeader('x-access-token', accessToken);
            const { decoded } = await decode(newAccessToken);
            req.user = decoded;
            req.admin = req.user.isAdmin;
            next();
        }

        return res.sendStatus(403);

    }
}
