import {v2 as cloudinary} from 'cloudinary';

import { getEnvVar } from './getEnvVar.js';

import { unlink } from "node:fs/promises";




const cloud_name = getEnvVar('CLOUDINARY_CLOUD_NAME');
const api_key = getEnvVar("CLOUDINARY_API_KEY");
const api_secret = getEnvVar("CLOUDINARY_API_SECRET");


cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
 });



export const saveFIleCloudnary = async file => {
    const response = await cloudinary.uploader.upload(file.path, {
     folder: "contactsphoto"
    });
    await unlink(file.path);
   return response.secure_url;
};

export const deleteFIleCloudnary = async fileUrl => {
    const fileId = fileUrl.split('/').slice(-2).join('/').split('.')[0];  
    if (!fileId) return;
    console.log (fileId);
    await cloudinary.uploader.destroy(fileId);
};


