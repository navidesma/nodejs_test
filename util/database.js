import Sequelize from "sequelize";

const sequelize = new Sequelize("nodejstest", "postgres", "salam12345", {
    dialect: "postgres"
});

export default sequelize;