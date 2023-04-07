import jwt from 'jsonwebtoken';
import { SC } from '../utils/statusCode.js';
import { Logging } from '../utils/Logging.js';

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
        decoded = jwt.verify(token, "EatetheCow");
        if(!decoded){
            return res.status(SC.UnAuthorized).json({status: false, message: 'Invalid Token'})
        } 
        console.log(decoded);
        req.userId = decoded.id;
        next();
    } catch(err){
        if(err.message.toString().includes('expired')){
            return res.status(SC.UnAuthorized).json({status: false, message: 'Token Expired, PLease Login'})
        }
        return res.status(SC.UnAuthorized).json({status: false, message: 'Invalid Token'})
    }
}

export default is_auth;