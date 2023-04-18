export async function isAdmin(req, res, next){
    if(!req.admin){
        return res.sendStatus(403);
    }
    next();
}