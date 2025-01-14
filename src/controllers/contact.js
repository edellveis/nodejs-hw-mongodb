import createError from 'http-errors';
import * as contactServices from '../services/contact.services.js';

import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { sortByList } from '../db/models/contac.js';
import { filterContactsParams } from '../utils/filters/filterContactsParams.js';

import { saveFileToUploadsDir } from '../utils/saveFileToUploadsDir.js';
import { getEnvVar } from '../utils/getEnvVar.js';
import { saveFIleCloudnary } from '../utils/saveFileToCloudinary.js';





export const getContactsController = async (req, res) => {
  const { perPage, page } = parsePaginationParams(req.query);

  const { sortBy, sortOrder } = parseSortParams(req.query, sortByList);

  const filter = filterContactsParams(req.query);
  filter.userId = req.user._id;

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

export const getContactsByIdController = async (req, res) => {
  const { id: userId } = req.user;
  const { id: _id } = req.params;

  const data = await contactServices.getContact({ _id, userId });

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully found contact with id ${_id}!`,
    data,
  });
};

export const addContactController = async (req, res) => {
  const cloudinaryEnable = getEnvVar("CLOUDINARY_ENABLE") === "true";
  let photo;

  if (req.file) {
    if (cloudinaryEnable) {
      photo = await saveFIleCloudnary(req.file);
    } else { 
      photo = await saveFileToUploadsDir(req.file);
    }
  } 
  
  const { id: userId } = req.user;
  const data = await contactServices.addContact({ ...req.body, photo, userId });
  
  res.status(201).json(
    {
    status: 201,
    message: 'Successfully created a contact!',
    data,
  }
  );
};

export const upsertContactController = async (req, res) => {
  const { id } = req.params;

  const { id: userId } = req.user;

  const { isNew, data } = await contactServices.updateContact(
    id,
    { ...req.body, userId },
    {
      upsert: true,
    },
  );

  const status = isNew ? 201 : 200;

  const statusResopnse = isNew ? 'created' : 'update';

  res.status(status).json({
    status,
    massege: `Successfully ${statusResopnse} a contact!`,
    data,
  });
};

export const patchContactController = async (req, res) => {;
  const { id: _id } = req.params;
  const { _id: userId } = req.user;

  
  const result = await contactServices.updateContact({ _id, userId }, req.body,{upsert: true});
  
  if (!result) {
    throw createError(404, 'Contact  not found');
  }

  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: result.data,
  });
  
  
};

export const deleteContactController = async (req, res) => {
  const { id: _id } = req.params;
  const { id: userId } = req.user;
  const data = await contactServices.deleteContact({ _id, userId });

  if (!data) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
};
