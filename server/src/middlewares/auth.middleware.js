import { JWT } from "#configs";
import { ERR_MSG } from "#constants";
import { BadRequestError } from "#responses";
import { pinoLogger } from "#utils";
import jwt from "jsonwebtoken";

export const isAuthenticated = (req, res, done) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  if (!accessToken) {
    return done(new BadRequestError(ERR_MSG.TOKEN_REQUIRED));
  }
  try {
    const payload = jwt.verify(accessToken, JWT.ACCESS_TOKEN_SECRET);
    req.user = payload;
    return done();
  } catch (err) {
    pinoLogger.error(err);
    if (err instanceof jwt.TokenExpiredError) {
      return done(new BadRequestError(ERR_MSG.EXPIRED_TOKEN));
    }

    return done(new BadRequestError(ERR_MSG.INVALID_TOKEN));
  }
};
