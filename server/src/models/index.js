import { postgres } from "#db";
import { pinoLogger } from "#utils";
import { VerificationCode } from "./verificationCode.model.js";
// await User.sync({ alter: true });
// pinoLogger.info("Table `User` synced!");
// await Channel.sync({ alter: true });
// pinoLogger.info("Table `Channel` synced!");
// await VerificationCode.sync({ alter: true });
// pinoLogger.info("Table `VerificationCode` synced!");
// await Message.sync({ alter: true });
// pinoLogger.info("Table `Message` synced!");
// await ChannelUser.sync({ alter: true });
// pinoLogger.info("Table `ChannelUser` synced!");
import { Channel } from "./channel.model.js";
import { Message } from "./message.model.js";
import { User } from "./user.model.js";

User.belongsToMany(Channel, { through: "ChannelUsers"});
Channel.belongsToMany(User, { through: "ChannelUsers"});

Channel.belongsTo(User, { foreignKey: "creator", targetKey: "id", onDelete: "CASCADE" });
VerificationCode.belongsTo(User, { foreignKey: "email", targetKey: "email", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "sender", targetKey: "id", onDelete: "CASCADE" });
Message.belongsTo(Channel, { foreignKey: "channelId", targetKey: "id", onDelete: "CASCADE" });
Channel.belongsTo(Message, {foreignKey: "lastMessage", targetKey: "id", onDelete: "SET NULL"});
await postgres.sync({ alter: true });
pinoLogger.info("All models were synchronized successfully.");

export * from "./channel.model.js";
// export * from "./channel_user.model.js";
export * from "./media.model.js";
export * from "./message.model.js";
export * from "./user.model.js";
export * from "./verificationCode.model.js";

