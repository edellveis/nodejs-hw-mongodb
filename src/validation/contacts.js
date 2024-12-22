import Joi from 'joi';
import { typeContacts } from '../constants/contacts.js';

export const contactsAddShema = Joi.object({
  name: Joi.string()
    .required()
    .min(3)
    .max(20)
    .message(`Minimum 3 of characters`),
  phoneNumber: Joi.string()
    .required()
    .min(3)
    .max(20)
    .message(`Minimum 3 of characters`),
  email: Joi.string().min(3).max(20).message(`Minimum 3 of characters`),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...typeContacts)
    .required(),
});

export const contactsUpdataShema = Joi.object({
  name: Joi.string().min(3).max(20).message(`Minimum 3 of characters`),
  phoneNumber: Joi.string().min(3).max(20).message(`Minimum 3 of characters`),
  email: Joi.string().min(3).max(20).message(`Minimum 3 of characters`),
  isFavourite: Joi.boolean(),
  contactType: Joi.string().valid(...typeContacts),
});
