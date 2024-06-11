import { EMAIL_STATUS } from "#constants";
import { postgres } from "#db";
import { DataTypes } from "sequelize";

export const User = postgres.define("User", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  emailStatus: {
    type: DataTypes.ENUM,
    values: Object.values(EMAIL_STATUS),
    defaultValue: EMAIL_STATUS.UNVERIFIED,
  },
  firstName: {
    type: DataTypes.STRING,
  },
  lastName: {
    type: DataTypes.STRING,
  },
});
