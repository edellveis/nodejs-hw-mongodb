import { createFakeContact } from "../utils/createFakeContact";
import { readContacts } from "../utils/readContacts";
import { writeContacts } from "../utils/writeContacts";

export const addOneContact = async () => {
    const data = await readContacts();
    const newContact = await createFakeContact();
    const newContactList = [...data, ...newContact];
    await writeContacts(newContactList);
};

addOneContact();
