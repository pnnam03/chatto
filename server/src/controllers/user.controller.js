import { userService } from "#services";

export class userController {
  static async getMyChannels(req, res) {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || null;
    const offset = parseInt(req.query.offset, 0) || null;
    const responseData = await userService.getMyChannels(userId, limit, offset);
    return res.status(200).send(responseData);
  }

  static async search(req, res) {
    const email = req.query.email;
    const userInfo = await userService.getInfo(null, email);
    return res.status(200).send(userInfo);
  }
}