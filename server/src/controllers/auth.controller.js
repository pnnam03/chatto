import { authService, userService } from "#services";
export class authController {
  static signIn = async (req, res) => {
    const { email, password } = req.body;

    const tokens = await authService.login(email, password);
    const user = await userService.getInfo(null,email);
    const responseData = {...user, ...tokens};
    return res.status(200).send(responseData);
  };

  static signUp = async (req, res) => {
    const { email, password, firstName, lastName} = req.body;
    const tokens = await authService.register(email, password, firstName, lastName);
    const user = await userService.getInfo(null, email);
    const responseData = {...user, ...tokens}
    return res.status(200).send(responseData);
  };

  static async changePassword(req, res) {
    const { email, password, newPassword } = req.body;
    const id = req.user.id;
    await authService.changePassword(id, email, password, newPassword);

    return res.status(200).send({ message: "Password changed successfully." });
  }

  static async verifyEmail(req, res) {
    const { email, verificationCode } = req.body;
    const id = req.user.id;

    await authService.verifyEmail(id, email, verificationCode);
    return res.status(200).send({ message: "Email has been verified." });
  }
}
