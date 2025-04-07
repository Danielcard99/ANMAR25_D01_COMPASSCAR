import { DataTypes } from "sequelize";
import db from "../config/database.js";
import Cars from "./Cars.js";

const CarsItem = db.define(
  "cars_items",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    car_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Cars,
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  { timestamps: true, updatedAt: false, underscored: true }
);

Cars.hasMany(CarsItem, { foreignKey: "car_id" });
CarsItem.belongsTo(Cars, { foreignKey: "car_id" });

export default CarsItem;
