import nodemailer from 'nodemailer';

import { SMTP } from '../constants/index.js';
import { getEnvVar } from '../utils/getEnvVar.js';






const nodemailerConfig = {
  host: getEnvVar(SMTP.SMTP_HOST),
  port: Number(getEnvVar(SMTP.SMTP_PORT)),
  secure: false,
  auth: {
    user: getEnvVar(SMTP.SMTP_USER),
    pass: getEnvVar(SMTP.SMTP_PASSWORD),
  },
};



const transport = nodemailer.createTransport(nodemailerConfig);

export const sendEmail = data => {
  const email = {...data, from: getEnvVar(SMTP.SMTP_FROM)};
    return transport.sendMail(email);
};