import { readContacts } from "../utils/readContacts";

export const countContacts = async () => {
   return  await readContacts().length;
};

console.log(await countContacts());
