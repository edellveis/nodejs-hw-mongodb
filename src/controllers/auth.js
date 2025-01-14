import * as authService from '../services/auth.js';

const setupSession = (res, session) => {
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie('sessionId', session.id, {
    httpOnly: true,
    expires: session.accessTokenValidUntil,
  });
};
export const registerController = async (req, res) => {
  const data = await authService.register(req.body);
  const { password, ...userData } = data._doc;

  res.status(201).json({
    status: 201,
    message: 'Successfully logged in an user!',
    data: userData,
  });
};


export const verifyController = async (req, res) => {
  const { token } = req.query;
  await authService.verify(token);
  res.json({
    status: 200,
    message: 'Successfully verified an user!',
  });
};


export const resetEmailController = async (req, res) => { 
  const { email } = req.body;
  await authService.resetEmail(email);
  res.status(200).json({
       status: 200,
       message: "Reset password email has been successfully sent.",
       data: {}
   });

};

export const resetPasswordController = async (req, res) => { 
  

  const { token, password } = req.body;
  await authService.resetPassword(token, password);

  
  res.status(200).json( {
       status: 200,
       message: "Password has been successfully reset.",
       data: {}
   });
};


export const loginController = async (req, res) => {
  const session = await authService.login(req.body);

  setupSession(res, session);
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in an user!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

export const logoutController = async (req, res) => {
  if (req.cookies.sessionId) {
    authService.logout(req.cookies.sessionId);
  }

  res.clearCookie('refreshToken');
  res.clearCookie('sessionId');

  res.status(204).send();
};

export const refreshTokenController = async (req, res) => {
  const { refreshToken, sessionId } = req.cookies;
  const session = await authService.refreshSession({ refreshToken, sessionId });
  setupSession(res, session);

  res.status(200).json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: {
      accessToken: session.accessToken,
    },
  });
};
