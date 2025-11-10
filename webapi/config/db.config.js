const { Sequelize } = require('sequelize');

// --- Config MariaDB (ejemplo) ---
// const sequelize = new Sequelize(
//   process.env.MYSQL_DATABASE,
//   process.env.MYSQL_USER,
//   process.env.MYSQL_PASSWORD,
//   {
//     dialect: 'mariadb',
//     dialectOptions: {
//       host: process.env.MYSQL_HOST,
//       port: process.env.MYSQL_PORT
//     }
//   }
// );

// --- Config SQLite ---
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'AmigoSecretoDB.sqlite'
});

async function initDB() {
  try {
    await sequelize.authenticate();
    // Activar FK constraints en SQLite
    if (sequelize.getDialect() === 'sqlite') {
      await sequelize.query('PRAGMA foreign_keys = ON;');
    }
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
}

initDB();

module.exports = {
  sequelize,
  Sequelize
};
