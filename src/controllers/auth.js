
import * as authService from '../services/auth.js';



export const registerController = async (req, res) => {
    const data = await authService.register(req.body);
     const { password, ...userData } = data._doc;

    res.status(201).json({

        status: 201,
        message: "Successfully logged in an user!",
        data: userData,
    });
};


export const loginController = async (req, res) => {
    const session = await authService.login(req.body);

    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: session.refreshTokenValidUntil,
    });
    
    res.cookie('sessionId', session.id, {
        httpOnly: true,
        expires: session.accessTokenValidUntil,
    });
    res.status(200).json({
        status: 200,
        message: "Successfully logged in an user!",
        data: {
            accessToken: session.accessToken
        },
    });
};