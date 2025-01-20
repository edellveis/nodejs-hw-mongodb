import { Router } from 'express';
import { validateBody } from '../utils/vadidateBody.js';

import { authRegisterSchema, googleOAuthSchema, resetEmailSchema, resetPasswordSchema } from '../validation/auth.js';
import { authLoginSchema } from '../validation/auth.js';
import { cntrlWapper } from '../utils/ctrlWrapper.js';

import * as authController from '../controllers/auth.js';

const authRouter = Router();

authRouter.post(
  '/register',
  validateBody(authRegisterSchema),
  cntrlWapper(authController.registerController),
);


  

authRouter.get('/verify', cntrlWapper(authController.verifyController));

authRouter.get("/get-oauth-url", cntrlWapper(authController.getGoogleOAuthurlController));

authRouter.post('/confirm-oauth', validateBody(googleOAuthSchema),cntrlWapper(authController.loginWithGoogleController));

authRouter.post('/send-reset-email', validateBody(resetEmailSchema), cntrlWapper(authController.resetEmailController));

authRouter.post('/reset-pwd', validateBody(resetPasswordSchema), cntrlWapper(authController.resetPasswordController));

authRouter.post(
  '/login',
  validateBody(authLoginSchema),
  cntrlWapper(authController.loginController),
);

authRouter.post('/refresh', cntrlWapper(authController.refreshTokenController));

authRouter.post('/logout', cntrlWapper(authController.logoutController));

export default authRouter;
