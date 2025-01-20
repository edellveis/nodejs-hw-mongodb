import { OAuth2Client } from "google-auth-library";
import * as path from "node:path";
import { readFile } from "node:fs/promises";
import { getEnvVar } from "./getEnvVar.js";
import createHttpError from "http-errors";


const googleOauthJsonPath = path.resolve('google-oauth.json');

const oauthConfig = JSON.parse(await readFile(googleOauthJsonPath, 'utf-8'));



const clientId = getEnvVar('GOOOGLE_OAUTH_CLIENT_ID');
const clientSecret = getEnvVar('GOOOGLE_OAUTH_CLIENT_SECRET');


const googleOauthClient = new OAuth2Client({
    clientId,
    clientSecret,
    redirectUri: oauthConfig.web.redirect_uris[0]
});


export const generateoAuthUrl = () => {
    const url = googleOauthClient.generateAuthUrl({
        scope: [
               'https://www.googleapis.com/auth/userinfo.email', 
               'https://www.googleapis.com/auth/userinfo.profile'  
                ],
    });
    return url;
};


export const vidateCode = async code => { 
    
    const response = await googleOauthClient.getToken(code);
    if(!response?.tokens?.id_token) throw createHttpError(400, response.error);
    
    const ticket = await googleOauthClient.verifyIdToken({
        idToken: response.tokens.id_token,
      
    });
    
    return ticket;
};



export const getUserNameFromGoogle = async payload => { 
    console.log(payload);
    
    if (payload.name) return payload.name;
    let username = "";
    if (payload.given_name) username += payload.given_name;
    if (payload.given_name && payload.family_name) username += " ${payload.family_name}";
    if (!payload.given_name && payload.family_name) {
        username += payload.family_name;
        console.log(username);
        return username;
    } 


};