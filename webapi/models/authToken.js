// models/AuthToken.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const AuthToken = sequelize.define('AuthToken', {
        token: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: true,
        },
        idUsuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    });
    return AuthToken;
};
