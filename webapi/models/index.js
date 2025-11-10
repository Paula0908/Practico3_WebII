const { sequelize } = require("../config/db.config");

const usuario = require("./usuario")(sequelize);
const authToken = require("./authToken")(sequelize);
const sorteo = require("./sorteo")(sequelize);
const participante = require("./participante")(sequelize);


usuario.hasMany(sorteo, { foreignKey: "idUsuario", as: "sorteos", onDelete: "CASCADE" });
sorteo.belongsTo(usuario, { foreignKey: "idUsuario", as: "owner" });

// Sorteo 1..N Participante
sorteo.hasMany(participante, { foreignKey: "sorteoId", as: "participantes", onDelete: "CASCADE" });
participante.belongsTo(sorteo, { foreignKey: "sorteoId", as: "sorteo" });

// cada participante tiene asignado a otro participante
participante.belongsTo(participante, { foreignKey: "assignedToId", as: "asignadoA" });
participante.hasOne(participante, { foreignKey: "assignedToId", as: "regalador" });

// Usuario 1..N AuthToken 
usuario.hasMany(authToken, { foreignKey: "idUsuario", as: "tokens", onDelete: "CASCADE" });
authToken.belongsTo(usuario, { foreignKey: "idUsuario", as: "usuario" });


module.exports = {
    usuario,
    authToken,
    sorteo,
    participante,
    sequelize,
    Sequelize: sequelize.Sequelize
}