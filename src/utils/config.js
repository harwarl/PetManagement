import dotenv from 'dotenv';
import { env } from 'process';
dotenv.config();

export const config = {

    PORT: Number(env.PORT),
    CLOUD_NAME: env.CLOUD_NAME,
    API_KEY: env.API_KEY,
    API_SECRET: env.API_SECRET,
    GMAIL_USER: env.GMAILUSER,
    GMAIL_PASS: env.GMAILPASS,
    GMAIL_HOST: env.GMAIL_HOST,
    GMAIL_PORT: Number(env.GMAIL_PORT),
    FROM_NAME: env.FROM_NAME
    
}