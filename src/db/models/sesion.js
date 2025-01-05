import { Schema, model } from 'mongoose';
import { handleSaveError, setUpdateSettings } from './hooks.js';



const sesionShema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true,
    },
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    accessTokenValidUntil: {
        type: Date,
        required: true,
    },
    refreshTokenValidUntil: {
        type: Date,
        required: true,
    }
}, { versionKey: false, timestamps: true });

sesionShema.post('save', handleSaveError);
sesionShema.pre('findOneAndUpdate', setUpdateSettings);
sesionShema.post('findOneAndUpdate', handleSaveError);


const SesionCollection = model('sesion', sesionShema);
export default SesionCollection;