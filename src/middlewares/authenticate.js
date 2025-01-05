 import createHttpError from "http-errors";
import {getSession} from "../services/auth.js";
 import {getUser} from "../services/auth.js";

export const authenticate = async (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return next(createHttpError(401, "Access token expired"));
    }
    const [bearer, accessToken] = authHeader.split(" ");
    if (bearer !== "Bearer"
    ) {  
     
        return next(createHttpError(401, "Access token expired"));
    }
     

    const session = await getSession({ accessToken });
    
    if (!session) {
        console.log('session', session);
        return next(createHttpError(401, "Session not found"));
    }
    if (session.accessTokenValidUntil < Date.now()) {
        
        return next(createHttpError(401, "Access token expired"));
    }
    const user = await getUser({ _id: session.userId });
    if (!user) {
      
        return next(createHttpError(401, "User not found"));

    }
    req.user = user;

    next();
 };