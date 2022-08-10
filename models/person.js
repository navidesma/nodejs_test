import Sequelize from "sequelize";

import sequelize from "../util/database.js";

const Person = sequelize.define('person', {
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

export default Person;