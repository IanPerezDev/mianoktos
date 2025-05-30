const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    define: {
      freezeTableName: true
    }
  }
);

const db = {};

// Carga todos los modelos del mismo directorio, excepto este archivo


fs.readdirSync(__dirname)
  .filter(file => file !== 'sequelize.js' && file.endsWith('.js'))
  .forEach(file => {
    const fullPath = path.join(__dirname, file);
    const exported = require(fullPath);

    // Verifica que el archivo exporta una función (modelo Sequelize)
    if (typeof exported === 'function') {
      const model = exported(sequelize, DataTypes);
      db[model.name] = model;
    } else {
      console.warn(`⚠️ Archivo ignorado: ${file} no exporta una función Sequelize`);
    }
  });


db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
