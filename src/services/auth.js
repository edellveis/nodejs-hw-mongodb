import UserCollection from '../db/models/user.js';
import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import SesionCollection from '../db/models/sesion.js';
import {
  accessTokenLifeTime,
  refreshTokenLifeTime,
} from '../constants/users.js';

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
  return newUser.save();
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
  console.log(oldSession);
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
