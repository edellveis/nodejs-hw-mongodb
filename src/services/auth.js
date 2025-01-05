import UserCollection from "../db/models/user.js";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import {randomBytes} from 'crypto';
import SesionCollection from "../db/models/sesion.js";
import { accessTokenLifeTime, refreshTokenLifeTime } from "../constants/users.js";


export const register = async (userData) => {

    const { email, password } = userData;


    const user = await UserCollection.findOne({ email });


    if (user) {
        throw createHttpError(409, "Email in use");
    }
     
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserCollection({ ...userData, password: hashedPassword });  
    return newUser.save();
};




export const login = async ({ email, password }) => {
    
    const user = await UserCollection.findOne({ email });
    if (!user) {
        throw createHttpError(401, "Invalid credentials");
    }
    



    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
        throw createHttpError(401, "Invalid credentials");
    }

    await SesionCollection.deleteOne({ userId: user._id });
    
    const accessToken = randomBytes(32).toString('base64');
    const refreshToken = randomBytes(32).toString('base64');

    return SesionCollection.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: Date.now() + accessTokenLifeTime, 
        refreshTokenValidUntil: Date.now() + refreshTokenLifeTime, 
    });
    
};

export const getUser = filter => {
     return UserCollection.findOne(filter);
};

export const getSession = async filter => 
      await SesionCollection.findOne(filter);