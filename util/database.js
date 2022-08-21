import Sequelize from "sequelize";
import dotenv from "dotenv";

dotenv.config();
const {DATABASE_HOST, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME, DATABASE_PORT} = process.env;


const sequelizeInstance = new Sequelize(DATABASE_NAME, DATABASE_USER, DATABASE_PASSWORD, {
    dialect: "mysql", host: DATABASE_HOST, port: DATABASE_PORT
});

export default sequelizeInstance;