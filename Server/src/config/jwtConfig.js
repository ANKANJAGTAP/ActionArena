import dotenv from 'dotenv';
dotenv.config();

export const secretKey = process.env.SECRET_KEY;  // Use a fixed secret from .env file
