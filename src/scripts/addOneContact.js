export const addOneContact = async () => {};

export const addOneContact = async () => {
  const contactList = await readContacts();
  const newContact = createFakeContact();
  await writeContacts([...contactList, newContact]);
};
addOneContact();
