import contactCollection from '../db/models/contac.js';

export const getContacts = () => contactCollection.find();

export const getContactsById = (id) => contactCollection.findById(id);
