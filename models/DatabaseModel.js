import { Sequelize } from "sequelize";
import db from "../config/database.js";

const { DataTypes } = Sequelize;

const Database_Karyawan = db.define(
  "database_karyawan",
  {
    nama: DataTypes.STRING,
    departemen: DataTypes.STRING,
    deskripsi_performance: DataTypes.STRING,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Database_Karyawan;

(async () => {
  await db.sync();
})();
