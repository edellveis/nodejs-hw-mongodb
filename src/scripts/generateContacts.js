import { createFakeContact } from '../utils/createFakeContact.js';

import { writeContacts } from '../utils/writeContacts.js';

export const generateContacts = async (number) => {
  const contactsList = Array(number).fill(0).map(createFakeContact);

  writeContacts(contactsList);
};
generateContacts(5);
