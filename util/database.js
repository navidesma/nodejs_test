import Sequelize from "sequelize";

const sequelize = new Sequelize("nodejstest", "navidesma", "salam12345", {
    dialect: "postgres"
});

export default sequelize;