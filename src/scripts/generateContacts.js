
import { createFakeContact } from '../utils/createFakeContact.js';

import { readContacts } from '../utils/readContacts.js';
import { writeContacts } from '../utils/writeContacts.js';

const generateContacts = async (number) => {
  const contactRead = await readContacts();
  const contactsList = Array(number).fill(null).map(createFakeContact);
  const newContactList = [...contactRead, ...contactsList];
  await writeContacts (newContactList);
  
};
generateContacts(5);
