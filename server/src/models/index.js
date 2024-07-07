import { postgres } from "#db";
import { pinoLogger } from "#utils";
import { Channel } from "./channel.model.js";
import { Media } from "./media.model.js";
import { Message } from "./message.model.js";
import { User } from "./user.model.js";
import { VerificationCode } from "./verificationCode.model.js";

User.belongsToMany(Channel, { through: "ChannelUsers", foreignKey: "channelId", targetKey: "id", onDelete: "CASCADE"});
Channel.belongsToMany(User, { through: "ChannelUsers", foreignKey: "userId", targetKey: "id", onDelete: "CASCADE"});

Channel.belongsTo(User, { foreignKey: "creator", targetKey: "id", onDelete: "CASCADE" });
VerificationCode.belongsTo(User, { foreignKey: "email", targetKey: "email", onDelete: "CASCADE" });
Message.belongsTo(User, { foreignKey: "sender", targetKey: "id", onDelete: "CASCADE" });

Message.belongsTo(Channel, { foreignKey: "channelId", targetKey: "id", onDelete: "CASCADE" });
Channel.belongsTo(Message, { foreignKey: "lastMessage", targetKey: "id",  onDelete: "CASCADE" });

Message.belongsTo(Media, { foreignKey: "file", targetKey: "id", onDelete: "CASCADE" });

await postgres.sync({ alter: true });
pinoLogger.info("All models were synchronized successfully.");

export * from "./channel.model.js";
// export * from "./channel_user.model.js";
export * from "./media.model.js";
export * from "./message.model.js";
export * from "./user.model.js";
export * from "./verificationCode.model.js";

