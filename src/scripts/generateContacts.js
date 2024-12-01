import { PATH_DB } from '../constants/contacts.js';
import { createFakeContact } from '../utils/createFakeContact.js';
import * as fs from 'node:fs/promises';

const generateContacts = async (number) => {
  const contactsList = Array(number).fill(null).map(createFakeContact);
  fs.readFile(PATH_DB, (error, data) => {
    console.log(error);
    console.log(data);
  });
};
generateContacts(5);
