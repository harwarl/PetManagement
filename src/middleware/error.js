export const error = (error, req, res, next) =>{
    return res.status(500).json({ message: error.messsage })
}