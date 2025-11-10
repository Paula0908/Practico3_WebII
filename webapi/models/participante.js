// models/Participante.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const Participante = sequelize.define("Participante", {
        nombreParticipante: { 
            type: DataTypes.STRING, 
            allowNull: false 
        },
        wishlist: { 
            type: DataTypes.TEXT, 
            allowNull: true, 
            defaultValue: "" 
        },
        accessLinkToken: { 
            type: DataTypes.UUID, 
            defaultValue: DataTypes.UUIDV4, 
            allowNull: false, 
            unique: true 
        },
        isIdentified: { 
            type: DataTypes.BOOLEAN, 
            allowNull: false, 
            defaultValue: false 
        },
        sorteoId: { 
            type: DataTypes.INTEGER, 
            allowNull: false 
        },
        assignedToId: { 
            type: DataTypes.INTEGER, 
            allowNull: true 
        } 
    },{
        indexes: [
            { fields: ["sorteoId"] },
            { unique: true, fields: ["accessLinkToken"] }
        ]
    });
    return Participante;
};