const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, defaultValue: null },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    sex: { type: DataTypes.ENUM('man', 'woman', 'other'), defaultValue: null },
    photo: { type: DataTypes.STRING, defaultValue: null },
    registrationDate: {type: DataTypes.STRING, allowNull: false },
}, { timestamps: false })

module.exports = { User }