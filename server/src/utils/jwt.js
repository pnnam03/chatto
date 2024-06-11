import { JWT } from "#configs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRY } from "../constants/index.js";

export const signAccessToken = (payload) => {
  const accessToken = jwt.sign(payload, JWT.ACCESS_TOKEN_SECRET, {
    expiresIn: JWT_EXPIRY.ACCESS_TOKEN,
  });
  return accessToken;
};

export const signRefreshToken = (id) => {
  const payload = { id: id };
  const refreshToken = jwt.sign(payload, JWT.REFRESH_TOKEN_SECRET, {
    expiresIn: JWT_EXPIRY.REFRESH_TOKEN,
  });
  return refreshToken;
};
