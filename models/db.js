const dbConfig = require('../config/db.config.js');
//export classes Sequelize and Datatypes
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
    host: dbConfig.HOST, dialect: dbConfig.dialect
    //  ,
    //  pool: {
    //      max: dbConfig.pool.max, min: dbConfig.pool.min,
    //      acquire: dbConfig.pool.acquire, idle: dbConfig.pool.idle
    //  }
});
//optional, test the connection
sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
const db = {};
db.sequelize = sequelize; //export the Sequelize instance (actual connection pool)
//import TUTORIAL model (and add here any other models defined within the API)
db.propostas = require("./propostas.model.js")(sequelize, DataTypes);

db.candidaturas = require("./candidaturas.model.js")(sequelize, DataTypes);
db.foruns = require("./foruns.model.js")(sequelize, DataTypes);
//define the 1:N relationship
db.foruns.belongsTo(db.propostas);
//db.foruns.belongsTo(db.user)
db.propostas.hasMany(db.candidaturas); // tutorialId is added into Comment model as FK
db.candidaturas.belongsTo(db.propostas);

module.exports = db;