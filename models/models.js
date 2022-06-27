const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    sex: { type: DataTypes.ENUM('man', 'woman', 'other') },
    photo: { type: DataTypes.STRING },
    registrationDate: {type: DataTypes.STRING},
}, { timestamps: false })

module.exports = { User }