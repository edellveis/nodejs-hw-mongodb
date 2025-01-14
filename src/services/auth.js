import UserCollection from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import SesionCollection from '../db/models/sesion.js';
import { readFile } from 'node:fs/promises';
import Handlebars from 'handlebars';
import { sendEmail } from '../utils/sendEmail.js';
import jwt from 'jsonwebtoken';


import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

import { getEnvVar } from '../utils/getEnvVar.js';
import { TEMPLATES_DIR } from '../constants/index.js';
import path from 'path';


const emailTemplatePath = path.join(TEMPLATES_DIR, 'verify-email.html');
const emailTemplateSource = await readFile(emailTemplatePath, 'utf8');



const appDomain = getEnvVar('APP_DOMAIN');
const jwtSecret = getEnvVar('JWT_SECRET');

const createSessionData = () => {
  return {
    accessToken: randomBytes(32).toString('base64'),
    refreshToken: randomBytes(32).toString('base64'),
    accessTokenValidUntil: Date.now() + accessTokenLifeTime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifeTime,
  };
};

export const register = async (userData) => {
  const { email, password } = userData;

  const user = await UserCollection.findOne({ email });
  
  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new UserCollection({ ...userData, password: hashedPassword });

  const template = Handlebars.compile(emailTemplateSource);

  const token = jwt.sign({email}, jwtSecret, {expiresIn: '5m'}); 
    
  const html = template({ link: `${appDomain}/verify?token=${token}`});
  const veryfyEmeil = {
    to: email,
    subject: 'Email verification',
    html,
  };
  
await sendEmail(veryfyEmeil);

  return newUser.save();
};



export const verify = async token => { 
  
  try {



    const { email } = jwt.verify(token, jwtSecret);
    const user = await UserCollection.findOne({ email });


    if (!user) {
      throw createHttpError(401, 'User not found');
    }
    await UserCollection.findOneAndUpdate({ _id: user.id }, { verify: true });
  } catch (error) {
    throw createHttpError(401, error.message);
  }
};


export const resetEmail = async (email) => {
  const user = await UserCollection.findOne({ email });
  
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const token = jwt.sign({ email }, jwtSecret, { expiresIn: '5m' }); 
  const resetPasswordLink = `${appDomain}/reset-password?token=${token}`;

  try {
    await sendEmail({
      to: email,
      subject: 'Reset password',
      html: `
        <p>Click the link below to reset your password:</p>
        <a href="${resetPasswordLink}">Click here to reset your password</a>
      `
    });
  } catch (error) {
      error.status = 500,
      error.message = 'Failed to send the reset password email, please try again later.';
      throw createHttpError(error);
  }
};

export const resetPassword = async (token, password) => {
  let email = null;
  try {
    const decoded = jwt.verify(token, jwtSecret);
    email = decoded.email;
  } catch (error) {
    throw createHttpError(401,  error.message = 'Token is expired or invalid.');
  }
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  await UserCollection.findOneAndUpdate({ _id: user.id }, { password: hashedPassword });


};





export const login = async ({ email, password }) => {
  const user = await UserCollection.findOne({ email });
  if (!user) {
    throw createHttpError(401, 'Invalid credentials');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Invalid credentials');
  }

  await SesionCollection.deleteOne({ userId: user._id });

  const sesionData = createSessionData();

  return SesionCollection.create({
    userId: user._id,
    ...sesionData,
  });
};
export const logout = async (sessionId) => {
  await SesionCollection.deleteOne({ _id: sessionId });
};

export const refreshSession = async (obejctSesion) => {
  const oldSession = await SesionCollection.findOne({
    refreshToken: obejctSesion.refreshToken,
    _id: obejctSesion.sessionId,
  });
  if (!oldSession) {
    throw createHttpError(401, 'Invalid session');
  }
  if (Date.now() > oldSession.refreshTokenValidUntil) {
    throw createHttpError(401, 'Successfully refreshed a session!');
  }
  await SesionCollection.deleteOne({ _id: obejctSesion.sessionId });

  const sesionData = createSessionData();
  return SesionCollection.create({
    userId: oldSession.userId,
    ...sesionData,
  });
};

export const getUser = (filter) => {
  return UserCollection.findOne(filter);
};

export const getSession = async (filter) =>
  await SesionCollection.findOne(filter);
