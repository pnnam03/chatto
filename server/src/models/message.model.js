import { MESSAGE_TYPE } from "#constants";
import { postgres } from "#db";
import { DataTypes } from "sequelize";

export const Message = postgres.define("Message", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  channelId: {
    type: DataTypes.UUID,
  },
  sender: {
    type: DataTypes.UUID,
  },
  type: {
    type: DataTypes.ENUM,
    values: Object.values(MESSAGE_TYPE),
    defaultValue: MESSAGE_TYPE.TEXT,
  },
  text: {
    type: DataTypes.TEXT,
  },
  file: {
    type: DataTypes.UUID
  }
});
