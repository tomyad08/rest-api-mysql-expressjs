import { Sequelize } from "sequelize";

const db = new Sequelize("database_karyawan", "root", "", {
  host: "localhost",
  dialect: "mysql",
});
export default db;
