import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    timezone: "-03:00",
    dialectOptions: {
      dateStrings: true,
    },
  }
);

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully!");

    await sequelize.query("SET time_zone = '-03:00';");
    console.log("Time zone set to -3:00");
  } catch (error) {
    console.log("Unable to connect to the database: ", error);
  }
}

testConnection();

export default sequelize;
