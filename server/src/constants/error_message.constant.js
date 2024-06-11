export const ERR_MSG = {
  // Token
  TOKEN_REQUIRED: {
    msg: "Either `accessToken` or `refreshToken` is required!",
  },
  INVALID_TOKEN: {
    msg: "Invalid token!",
  },
  EXPIRED_TOKEN: {
    msg: "Token expired!",
  },
  //
  WRONG_USERNAME_OR_PASSWORD: {
    msg: "Wrong username or password!",
  },
  // email
  EMAIL_EXISTS: {
    msg: "Email already exists.",
  },
  EMAIL_ALREADY_VERIFIED: {
    msg: "Email already verified.",
  },
  WRONG_VERIFICATION_CODE: {
    msg: "Wrong verification code!",
  },
  EXPIRED_VERIFICATION_CODE: {
    msg: "Expired verification code!",
  },
  // database record
  RECORD_NOT_FOUND: {
    msg: "Record not found!",
  },
  // password 
  NOT_A_NEW_PASSWORD: {
    msg: "New password must be different from the current password"
  }
};
