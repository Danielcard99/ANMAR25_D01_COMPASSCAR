import { DataTypes } from "sequelize";
import db from "../db/connection.js";
import Cars from "./Cars.js";

const CarsItem = db.define("cars_items", {
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
});

Cars.hasMany(CarsItem, { foreignKey: "car_id" });
CarsItem.belongsTo(Cars, { foreignKey: "car_id" });

export default CarsItem;
