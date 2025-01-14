import { Router } from 'express';
import * as contactController from '../controllers/contact.js';
import { cntrlWapper } from '../utils/ctrlWrapper.js';
import {
  contactsAddShema,
  contactsUpdataShema,
} from '../validation/contacts.js';
import { validateBody } from '../utils/vadidateBody.js';
import { upload } from '../middlewares/multer.js';
import { isValidId } from '../middlewares/isValidid.js';
import { authenticate } from '../middlewares/authenticate.js';

const contactRouter = Router();

contactRouter.use(authenticate);

contactRouter.get('/', cntrlWapper(contactController.getContactsController));



contactRouter.get(
  '/:id',
  isValidId,
  cntrlWapper(contactController.getContactsByIdController),
);




contactRouter.post(
  '/',
  upload.single("photo"),
  validateBody(contactsAddShema),
  cntrlWapper(contactController.addContactController),
);

// upload.fields([{name: "poster", maxCount: 1}, {name: "subposter", maxCount: 4}])
// файли в декількох полях



// upload.array("poster", 8)  
// Декілька файлів 

contactRouter.put(
  '/:id',
  isValidId,
  upload.single("photo"),
  validateBody(contactsUpdataShema),
  cntrlWapper(contactController.upsertContactController),
);



contactRouter.patch(
  '/:id',
  isValidId,
  upload.single("photo"),
  validateBody(contactsUpdataShema),
  cntrlWapper(contactController.patchContactController),
);



contactRouter.delete(
  '/:id',
  cntrlWapper(contactController.deleteContactController),
);






export default contactRouter;
