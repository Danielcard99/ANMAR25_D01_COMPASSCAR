import { DataTypes } from "sequelize";
import db from "../config/database.js";

const Cars = db.define(
  "cars",
  {
    brand: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    year: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    plate: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  { timestamps: true, updatedAt: false }
);

export default Cars;
