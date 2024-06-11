import dotenv from "dotenv";

dotenv.config();

export const APP = {
  PORT: process.env.PORT,
};

export const JWT = {
  ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
};

export const EMAIL = {
  ADDRESS: process.env.EMAIL_ADDRESS,
  PASSWORD: process.env.EMAIL_PASSWORD,
};

export const DATABASE = {
  DB: process.env.DB,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  HOST: process.env.DB_HOST,
  PORT: process.env.DB_PORT,
  NAME: process.env.DB_NAME,
};
