import { EMAIL_STATUS, ERR_MSG, VERIFICATION_CODE_EXPIRATION_DURATION } from "#constants";
import { VerificationCode } from "#models";
import { BadRequestError } from "#responses";
import { generateVerificationCode, sendMail, signAccessToken, signRefreshToken } from "#utils";
import bcrypt from "bcrypt";
import { userService } from "./user.service.js";

export class authService {
  static async register(email, password, firstName, lastName) {
    await userService.create(email, password, firstName, lastName);

    const verificationCode = generateVerificationCode();
    await sendMail(email, verificationCode);
    await VerificationCode.create({
      email: email,
      verificationCode: verificationCode,
    });

    const tokens = await this.genToken(email);
    return tokens;
  }

  static async login(email, password) {
    const isUserExists = await userService.checkUserCredentials(email, password);
    if (!isUserExists) throw new BadRequestError(ERR_MSG.WRONG_USERNAME_OR_PASSWORD);

    const tokens = await this.genToken(email);
    return tokens;
  }

  static async genToken(email) {
    const userId = await userService.getIdByEmail(email);
    const payload = { email: email, id: userId };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    return { accessToken, refreshToken };
  }

  static async changePassword(id, email, password, newPassword) {
    const areUserCredentialsValid = await userService.checkUserCredentials(email, password);
    if (!areUserCredentialsValid) throw new BadRequestError(ERR_MSG.WRONG_USERNAME_OR_PASSWORD);
    if (password === newPassword) throw new BadRequestError(ERR_MSG.NOT_A_NEW_PASSWORD);
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    await userService.update(id, { password: hashedNewPassword });
  }

  static async verifyEmail(id, email, verificationCode) {
    const userRecord = await userService.getOne(id);
    // check if email has already been verified
    if (userRecord.emailStatus === EMAIL_STATUS.VERIFIED) throw new BadRequestError(ERR_MSG.EMAIL_ALREADY_VERIFIED);

    // check if verification code is valid
    const verificationRecord = await VerificationCode.findOne({
      where: { email: email, verificationCode: verificationCode },
    });
    if (!verificationRecord) throw new BadRequestError(ERR_MSG.WRONG_VERIFICATION_CODE);

    // check if verification code is expired
    const expirationTime = new Date(
      verificationRecord.createdAt.getTime() + VERIFICATION_CODE_EXPIRATION_DURATION * 60000,
    ); // Convert minutes to milliseconds
    if (new Date() > expirationTime) {
      // Expired verification code
      throw new BadRequestError(ERR_MSG.EXPIRED_VERIFICATION_CODE);
    }

    // Delete all verification records associated with the email
    await VerificationCode.destroy({
      where: { email: email },
    });

    userRecord.emailStatus = EMAIL_STATUS.VERIFIED;
    await userRecord.save();
  }
}
