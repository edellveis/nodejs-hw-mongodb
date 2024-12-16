import { Router } from 'express';
import * as contactController from '../controllers/contact.js';
import { cntrlWapper } from '../utils/ctrlWrapper.js';

const contactRouter = Router();

contactRouter.get('/', cntrlWapper(contactController.getContactsController));
contactRouter.get('/:id', cntrlWapper(contactController.getContactsById));

contactRouter.post('/', cntrlWapper(contactController.addContactController));

contactRouter.put(
  '/:id',
  cntrlWapper(contactController.upsertContactController),
);

contactRouter.patch(
  '/:id',
  cntrlWapper(contactController.patchContactController),
);
contactRouter.delete(
  '/:id',
  cntrlWapper(contactController.deleteContactController),
);

export default contactRouter;
