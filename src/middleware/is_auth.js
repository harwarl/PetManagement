import jwt from 'jsonwebtoken';
import { SC } from '../utils/statusCode.js';

const is_auth = function (req, res, next){
    const authHeader = req.get("Authorization");

    if(!authHeader){
        return res.status(SC.UnAuthorized).json({
            status: false,
            message: "Authorization Header is not Present"
        })
    }
    const token = authHeader.split(' ')[1];

    let decoded;
    try{
        console.log(decoded);
        decoded = jwt.verify(token, "EatetheCow");
        console.log(decoded);
        if(!decoded){
            return res.status(SC.UnAuthorized).json({status: false, message: 'Invalid Token'})
        } 
        req.userId = decoded.id;
        next();
    } catch(err){
        if(err.message.toString().includes('expired')){
            return res.status(SC.UnAuthorized).json({status: false, message: 'Token Expired, PLease Login'})
        }
    }
}

export default is_auth;