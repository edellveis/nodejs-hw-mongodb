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

export const getContact = (filter) => contactCollection.findOne(filter);

export const addContact = (data) => contactCollection.create(data);

export const updateContact = async (filter, contact, options = {}) => {
  console.log("filter", filter);
  //filter {
  // _id: '677d81e14b03b48f8a3f958f',
  // userId: new ObjectId('67795d9da3800d22056cadb4')
  // }
  console.log("contact", contact);
// contact {
//   name: 'Jas',
//   phoneNumber: '112313123',
//   email: 'uta@gmail.com',
//   contactType: 'personal',
//   isFavourite: true
// }
  console.log("Початок функції updateContact");
  // проходить тест
  
  const { upsert = false } = options;
  console.log("upsert", upsert);
  // upsert ture

  const result = await contactCollection.findOneAndUpdate(filter, contact, {
    upsert,
    includeResultMetadata: true,
  });
  console.log("result", result);//// Цей тест не проходить
  

  if (!result || !result.value) return null;
  const isNew = Boolean(result.lastErrorObject.upserted);
  return {
    isNew,
    data: result.value,
  };
};

export const deleteContact = (filter) =>
  contactCollection.findOneAndDelete(filter);
