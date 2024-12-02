import { readContacts } from '../utils/readContacts.js';

export const countContacts = async () => {
  const countContacts = await readContacts();
  return countContacts.length;
};

console.log(await countContacts());
