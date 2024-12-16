import contactCollection from '../db/models/contac.js';

export const getContacts = () => contactCollection.find();

export const getContactsById = (id) => contactCollection.findById(id);

export const addContact = (data) => contactCollection.create(data);

export const updateContact = async (_id, contact, options = {}) => {
  const { upsert = false } = options;
  const result = await contactCollection.findByIdAndUpdate({ _id }, contact, {
    new: true,
    upsert,
    includeResultMetadata: true,
  });

  if (!result || !result.value) {
    return null;
  }

  const isNew = Boolean(result.lastErrorObject.upserted);
  return {
    isNew,
    data: result.value,
  };
};

export const deleteContact = (filter) =>
  contactCollection.findOneAndDelete(filter);
