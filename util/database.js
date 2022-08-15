import Sequelize from "sequelize";

const sequelizeInstance = new Sequelize("nodejstest", "postgres", "salam12345", {
    dialect: "postgres"
});

export default sequelizeInstance;