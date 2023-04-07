import multer from "multer";
import path from 'path';

const storage = multer.diskStorage({});

export const uploadImage = multer({
    storage: storage,
    fileFilter: (req, file, cb)=>{
        const ext = path.extname(file.originalname);
        if(ext !== '.jpg' &&  ext !== '.jpeg' &&  ext !== '.png' &&  ext != '.jfif' && ext !== '.psd' &&  ext !== '.bmp'){
            cb(new Error('Image File not Supported'), false);
            return;
        }

        cb(null, true);
    }
})