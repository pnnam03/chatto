import { postgres } from "#db";
import { Channel, Message } from "#models";
import { baseService } from "./base.service.js";
import { userService } from "./user.service.js";
export class messageService {
  static async create(sender, channelId, type, data) {
    const record = postgres.transaction(async (t) => {
      const message = await Message.create({ sender, channelId, type, data });
      const senderInfo = await userService.getInfo(message.sender);
      const channel = await baseService.getOne(Channel, channelId);
      channel.lastMessage = message.id;
      await channel.save();
      return { ...message.dataValues, sender: senderInfo};
    });

    return record;
  }

  static async update(messageId, type, data) {
    const body = { type, data };
    const record = await baseService.update(Message, id, body);

    return record;
  }

  static async getOne(id) {
    const record = await baseService.getOne(Message, id);
    return record;
  }

  static async getList(channelId, limit, offset) {
    const filter = { channelId };
    const messages = await baseService.getList(Message, limit, offset, filter);
    const response = await Promise.all(
      messages.map(async (message) => {
        const senderInfo = await userService.getInfo(message.sender);
        return { ...message.dataValues, sender: senderInfo };
      }),
    );
    return response;
  }
}
