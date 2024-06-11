import { messageService } from "#services";

export class messageController {
  static async create(req, res) {
    const {type, data} = req.body;
    const sender = req.user.id;
    const channelId = req.params.channelId;
    const responseData = await messageService.create(sender, channelId, type, data);
    return res.status(200).send(responseData);
  }

  static async update(req, res) {
    const messageId = req.params.messageId;
    const { type, data } = req.body;
    const responseData = await messageService.update(messageId, type, data);
    return res.status(200).send(responseData);
  }

  static async getList(req, res) {
    const channelId = req.params.channelId;
    const limit = parseInt(req.query.limit, 10) || null;
    const offset = parseInt(req.query.offset, 10) || null;
    const responseData = await messageService.getList(channelId, limit, offset);
    return res.status(200).send(responseData);
  }
}
