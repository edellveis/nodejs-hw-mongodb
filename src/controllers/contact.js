import createError from 'http-errors';
import * as contactServices from '../services/contact.services.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/contac.js';
import { filterContactsParams } from '../utils/filters/filterContactsParams.js';

export const getContactsController = async (req, res) => {
  
  const { perPage, page } = parsePaginationParams(req.query);

    
  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);





  const filter =  filterContactsParams(req.query);
  
  
  const data = await contactServices.getContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    filter,
  });

  res.json({
    status: 200,
    message: 'Successfully found contacts',
    data,
  });
};

export const getContactsById = async (req, res) => {
  const { id } = req.params;

  const data = await contactServices.getContactsById(id);

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const data = await contactServices.addContact(req.body);

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data,
  });
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;
  const { isNew, data } = await contactServices.updateContact(id, req.body, {
    upsert: true,
  });

  const status = isNew ? 201 : 200;

  const statusResopnse = isNew ? 'created' : 'update';

  res.status(status).json({
    status,
    massege: `Successfully ${statusResopnse} a contact!`,
    data,
  });
};

export const patchContactController = async (req, res) => {
  const { id } = req.params;
  const result = await contactServices.updateContact(id, req.body);

  if (!result) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
};

export const deleteContactController = async (req, res) => {
  const { id } = req.params;
  const data = await contactServices.deleteContact({ _id: id });

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
