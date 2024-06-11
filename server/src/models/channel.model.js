import { postgres } from "#db";
import { DataTypes } from "sequelize";
export const Channel = postgres.define("Channel", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  creator: {
    type: DataTypes.UUID,
  },
  name: {
    type: DataTypes.STRING,
  },
  lastMessage: {
    type: DataTypes.UUID,
  }
});
