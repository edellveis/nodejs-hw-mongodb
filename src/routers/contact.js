import { Router } from 'express';
import * as contactController from '../controllers/contact.js';
import { cntrlWapper } from '../utils/ctrlWrapper.js';
import {
  contactsAddShema,
  contactsUpdataShema,
} from '../validation/contacts.js';
import { validateBody } from '../utils/vadidateBody.js';

import { isValidId } from '../middlewares/isValidid.js';

const contactRouter = Router();

contactRouter.get('/', cntrlWapper(contactController.getContactsController));
contactRouter.get(
  '/:id',
  isValidId,
  cntrlWapper(contactController.getContactsById),
);

contactRouter.post(
  '/',
  validateBody(contactsAddShema),
  cntrlWapper(contactController.addContactController),
);

contactRouter.put(
  '/:id',
  isValidId,
  validateBody(contactsUpdataShema),
  cntrlWapper(contactController.upsertContactController),
);

contactRouter.patch(
  '/:id',
  isValidId,
  validateBody(contactsUpdataShema),
  cntrlWapper(contactController.patchContactController),
);
contactRouter.delete(
  '/:id',
  cntrlWapper(contactController.deleteContactController),
);

export default contactRouter;
