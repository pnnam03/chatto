import { channelService } from "#services";

export class channelController {
  static async create(req, res) {
    const { name, members } = req.body;
    const userId = req.user.id;
    const responseData = await channelService.create(name, userId, members);
    return res.status(200).send(responseData);
  }

  static async update(req, res) {
    const channelId = req.params.channelId;
    const { name, members } = req.body;
    const responseData = await channelService.update(channelId, name, members);
    return res.status(200).send(responseData);
  }

  static async getInfo(req, res) {
    const channelId = req.params.channelId;
    const userId = req.user.id;
    const responseData = await channelService.getInfo(channelId);
    return res.status(200).send(responseData);
  }

  static async getList(req, res) {
    const userId = req.user.id;
    const limit = parseInt(req.query.limit, 10) || null;
    const offset = parseInt(req.query.offset, 10) || null;
    const responseData = await channelService.getList(userId, limit, offset);
    return res.status(200).send(responseData);
  }

  static async addMembers(req, res) {
    const members = req.body.members;
    const channelId = req.params.channelId;
    const responseData = await channelService.addMembers(channelId, members);
    return res.status(200).send(responseData);
  }
}