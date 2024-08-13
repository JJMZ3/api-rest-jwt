const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Crear una instancia de Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
});

// Probar la conexión
sequelize.authenticate()
    .then(() => {
        console.log('Conexión a la base de datos exitosa');
    })
    .catch(err => {
        console.error('No se pudo conectar a la base de datos:', err);
    });

module.exports = sequelize;
