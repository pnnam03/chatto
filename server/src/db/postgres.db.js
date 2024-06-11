import { DATABASE } from "#configs";
import { pinoLogger } from "#utils";
import cls from "cls-hooked";
import { Sequelize } from "sequelize";

const namespace = cls.createNamespace('chatto-postgres');
Sequelize.useCLS(namespace);

async function initializeSequelize() {
  try {
    const sequelize = new Sequelize({
      dialect: DATABASE.DB,
      database: DATABASE.NAME,
      username: DATABASE.USER,
      password: DATABASE.PASSWORD,
      host: DATABASE.HOST,
      port: DATABASE.PORT,
      logging: false,
    });

    await sequelize.authenticate();
    pinoLogger.info("Connection to the database has been established successfully.");
    return sequelize;
  } catch (err) {
    pinoLogger.error("Unable to connect to the database");
    pinoLogger.error(err);
    process.exit(1);
  }
}

export const postgres = await initializeSequelize() || null;
