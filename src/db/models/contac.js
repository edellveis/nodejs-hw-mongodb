import { Schema, model } from 'mongoose';
import { typeContacts } from '../../constants/contacts.js';
import { handleSaveError, setUpdateSettings } from './hooks.js';

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    email: {
      type: String,
    },
    isFavourite: {
      type: Boolean,
      default: false,
      required: true,
    },
    contactType: {
      type: String,
      enum: typeContacts,
      required: true,
      default: 'personal',
    },
  },
  { versionKey: false, timestamps: true },
);

contactSchema.post('save', handleSaveError);
contactSchema.pre('findOneAndUpdate', setUpdateSettings);
contactSchema.post('findOneAndUpdate', handleSaveError);

export const sortByList = [
  '_id',
  'phoneNumber',
  'email',
  'isFavourite',
  'contactType',
];

const contactCollection = model('contact', contactSchema);

export default contactCollection;
