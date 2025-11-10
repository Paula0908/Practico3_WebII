// models/Usuario.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Usuario = sequelize.define('Usuario', {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: { isEmail: true },
        },  
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },  
        nombreCompleto: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { len: [1, 255] },
        }
    });
    return Usuario;
};
