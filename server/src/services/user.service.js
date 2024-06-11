import { ERR_MSG } from "#constants";
import { User } from "#models";
import { BadRequestError } from "#responses";
import bcrypt from "bcrypt";
import { baseService } from "./base.service.js";
import { channelService } from "./channel.service.js";

export class userService {
  static async create(email, password, firstName, lastName) {
    const isEmailExists = await this.isEmailExists(email);
    if (isEmailExists) throw new BadRequestError(ERR_MSG.EMAIL_EXISTS);

    const hashedPassword = await bcrypt.hash(password, 10);

    const record = await baseService.create(User, {
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    return record;
  }

  static async update(id, body) {
    const record = await baseService.update(User, id, body);

    return record;
  }

  static async getOne(id) {
    const record = await baseService.getOne(User, id);

    return record;
  }

  static async delete(id) {
    const record = await baseService.delete(User, id);

    return record;
  }

  static async getList(limit, offset, filter, order) {
    const records = await baseService.getList(User, limit, offset, filter, order);

    return records;
  }

  static async getMyChannels(userId, limit, offset) {
    // const user = await baseService.getOne(User, userId);
    // const channels = await user.getChannels({limit, offset});
    // return channels;

    const user = await baseService.getOne(User, userId);
    const channels = await user.getChannels({ limit, offset });
    
    const channelsPromises = channels.map((channel) => channelService.getInfo(channel.id));
    const channelsInfo = await Promise.all(channelsPromises);
    return channelsInfo;
  }

  static async getInfo(userId, email) {
    if (!userId && !email) return null;
    const id = userId ? userId : await this.getIdByEmail(email);
    const user = await baseService.getOne(User, id);
    const response = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };
    return response;
  }

  static async getIdByEmail(email) {
    const record = await baseService.findOne(User, { email: email });
    return record ? record.id : null;
  }

  static async isEmailExists(email) {
    const record = await baseService.findOne(User, { email: email });
    return record !== null;
  }

  static async checkUserCredentials(email, password) {
    const record = await baseService.findOne(User, { email: email });
    if (!record) return false;

    const isCorrectPassword = await bcrypt.compare(password, record.password);
    return isCorrectPassword;
  }
}
