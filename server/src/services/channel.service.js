import { postgres } from "#db";
import { Channel, User } from "#models";
import { pinoLogger } from "#utils";
import { baseService } from "./base.service.js";

export class channelService {
  static async create(name, creator, members) {
    if (!name) throw new Error("`name` is required");
    if (!members) throw new Error("`members` is required");
    if (!creator) throw new Error("`creator` is required");
    if (members.length === 0) throw new Error("`members` must not be empty");
    const record = postgres.transaction(async (t) => {
      // create new channel
      const channel = await Channel.create({ name, creator });
      // get user records3
      const memberPromises = members.map((id) => baseService.getOne(User, id));
      const memberResults = await Promise.all(memberPromises);
      // handle invalid user id
      const nullIndex = memberResults.findIndex((member) => member === null);
      if (nullIndex !== -1) throw new Error(`User with ID ${members[nullIndex]} could not be found`);
      await channel.addUsers(memberResults);

      const userAttributes = ["id", "firstName", "lastName"];
      const memberRecords = await channel.getUsers({ attributes: userAttributes });
      return {...channel.dataValues, members: memberRecords};
    });
    return record;
  }

  static async update(channelId, body) {
    const record = await baseService.update(Channel, channelId, body);
    return record;
  }

  static async getInfo(channelId) {
    const channel = await baseService.getOne(Channel, channelId);
    if (!channel) return {};
    const userAttributes = ["id", "firstName", "lastName"];
    const members = await channel.getUsers({ attributes: userAttributes });
    const lastMessage = await channel.getMessage({ attributes: ["id", "updatedAt", "type", "text", "sender"] });
    var response;
    if (!lastMessage) response = { ...channel.dataValues, members };
    else {
      const senderInfo = await lastMessage.getUser({ attributes: ["id", "firstName"] });
      const lastMessageInfo = { ...lastMessage.dataValues, sender: senderInfo };
      response = { ...channel.dataValues, members, lastMessage: lastMessageInfo };
    }
    response.creator = await channel.getUser({attributes: ['firstName', 'lastName', 'id', 'email']});
    return response;
  }

  static async getList(userId, limit, offset, filter, order) {
    const user = await baseService.getOne(User, userId);
    const channels = await user.getChannels({ limit, offset });
    const channelsPromises = channels.map((channel) => this.getInfo(channel.channelId));
    const channelsInfo = await Promise.all(channelsPromises);
    return channelsInfo;
  }

  static async getMembers(channelId, limit, offset, order) {
    const channel = await baseService.getOne(Channel, channelId);
    const members = await channel.getUsers();
    return members;
  }

  static async isMemberOfChannel(channelId, userId) {
    const members = this.getMembers(channelId);
    pinoLogger(members);
    return members.includes(userId);
  }

  static async addMembers(channelId, newMembers) {
    const records = postgres.transaction(async (t) => {
      const channel = await baseService.getOne(Channel, channelId);
      const newMemberPromises = newMembers.map((user) => baseService.getOne(User, user.id));
      const newMemberResults = await Promise.all(newMemberPromises);
      await channel.addUsers(newMemberResults);

      const userAttributes = ["id", "firstName", "lastName"];
      const memberRecords = await channel.getUsers({ attributes: userAttributes });
      return {...channel.dataValues, members: memberRecords};
    });
    return records;
  }
}
