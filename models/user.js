import Sequelize from "sequelize";
import sequelizeInstance from "../util/database.js";

const User = sequelizeInstance.define("User", {
    id: {
        type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true
    }, username: {
        type: Sequelize.STRING, allowNull: false
    }, password: {
        type: Sequelize.STRING, allowNull: false
    }
});

export default User;

