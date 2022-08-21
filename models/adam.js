import Sequelize from "sequelize";
import sequelizeInstance from "../util/database.js";

const Adam = sequelizeInstance.define('Adam', {
    id: {
        type: Sequelize.INTEGER, autoIncrement: true, allowNull: false, primaryKey: true
    }, name: {
        type: Sequelize.STRING, allowNull: false
    }, age: {
        type: Sequelize.INTEGER, allowNull: false
    }, gender: {
        type: Sequelize.STRING, allowNull: false
    }
})

export default Adam;