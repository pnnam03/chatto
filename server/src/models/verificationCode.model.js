import { postgres } from "#db";
import { DataTypes } from "sequelize";

export const VerificationCode = postgres.define("VerificationCode", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  email: {
    type: DataTypes.STRING,
  },
  verificationCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
