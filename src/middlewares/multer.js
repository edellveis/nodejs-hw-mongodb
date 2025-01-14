    
import multer from 'multer';

import { TEMP_UPLOAD_DIR } from '../constants/index.js';

import createHttpError from 'http-errors';

const storage = multer.diskStorage({
 
    destination: TEMP_UPLOAD_DIR,
    filename: (req, file, cb) => {

        const uniquePrefix = `${Date.now()} _${Math.round(Math.random() * 1e9)}`;

        const filename = `${uniquePrefix}_${file.originalname}`;

        cb(null, filename);
        
    }

});

const limit = {
    fileSize: 10 * 1024 * 1024, // 10MB
};

const fileFilter = (req, file, cb) => {
    const extentions = file.originalname.split('.').pop();

    if (extentions === "exe") {
       return cb(createHttpError(400,"file with .exe extension not allowed"));
    }
     
    cb(null, true);
};


 export const upload = multer({ storage, limit, fileFilter });