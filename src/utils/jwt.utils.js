import jwt from "jsonwebtoken";

export async function signToken(input, options){
    const token = jwt.sign(input, "ljskjaskjalka", options); 
    return token
}

export async function decode( token ){
    try{
        const decoded = jwt.decode(token, "ljskjaskjalka");
        return {
            expired: false,
            decoded: decoded,
            valid: true
        }
    }catch(e){
        console.log(e.message)
        return {
            valid: false,
            decoded: null,
            expired: e.message === 'jwt expired'
        }
    }

}