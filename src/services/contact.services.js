import contactCollection from '../db/models/contac.js';
import { calcPaginationData } from '../utils/calcPaginationData.js';

export const getContacts = async ({
  page = 1,
  perPage = 10,
  sortBy = '_id',
  sortOrder = 'asc',
  filter = {},
}) => {
  const limit = perPage;
  const skip = (page - 1) * limit;

  const contactsQuery = contactCollection.find();

  if (filter.type) {
    contactsQuery.where('contactType').equals(filter.type);
  }

  if (filter.isFavourite) {
    contactsQuery.where('isFavourite').equals(filter.isFavourite);
  }

  if (filter.userId) {
    contactsQuery.where('userId').equals(filter.userId);
  }

  const totalitems = await contactCollection
    .find()
    .merge(contactsQuery)
    .countDocuments();

  const data = await contactsQuery
    .skip(skip)
    .limit(limit)
    .sort({ [sortBy]: sortOrder });
  const paginationData = calcPaginationData({ totalitems, page, perPage });

  return {
    data,
    ...paginationData,
  };
};

export const getContact = (id) => contactCollection.findById(id);

export const addContact = (data) => contactCollection.create(data);

export const updateContact = async (filter, contact, options = {}) => {
  const { upsert = false } = options;
  const result = await contactCollection.findByIdAndUpdate(filter, contact, {
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
