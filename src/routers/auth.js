import { Router } from "express";
import { validateBody } from "../utils/vadidateBody.js";

import { authRegisterSchema } from "../validation/auth.js";
import { authLoginSchema } from "../validation/auth.js";
import { cntrlWapper } from '../utils/ctrlWrapper.js';

import * as  authController from '../controllers/auth.js';



const authRouter = Router();


authRouter.post('/register', validateBody(authRegisterSchema), cntrlWapper(authController.registerController));




authRouter.post('/login', validateBody(authLoginSchema), cntrlWapper(authController.loginController));








export default authRouter;  