import Sequelize from "sequelize";

const sequelizeInstance = new Sequelize("fornode", "root", "salam12345", {
    dialect: "mysql", host: "localhost"
});

export default sequelizeInstance;