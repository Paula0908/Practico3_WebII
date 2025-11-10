// models/Sorteo.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Sorteo = sequelize.define("Sorteo", {
        nombre: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        fechaEvento: { 
            type: DataTypes.DATE, 
            allowNull: false 
        },
        isStarted: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false 
        },
        idUsuario: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        accessToken: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            allowNull: false, 
            unique: true 
        }
    },{
        indexes: [{ unique: true, fields: ["accessToken"] }, { fields: ["idUsuario"] }]
    });
    return Sorteo;
};
