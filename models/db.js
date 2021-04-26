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
db.proposta = require("./propostas.model.js")(sequelize, DataTypes);

<<<<<<< HEAD
db.candidaturas = require("./candidaturas.model.js")(sequelize, DataTypes);
db.foruns = require("./foruns.model.js")(sequelize, DataTypes);
//define the 1:N relationship
db.foruns.belongsTo(db.propostas);
//db.foruns.belongsTo(db.user)
db.propostas.hasMany(db.candidaturas); // tutorialId is added into Comment model as FK
db.candidaturas.belongsTo(db.propostas);
=======
db.candidatura = require("./candidaturas.model.js")(sequelize, DataTypes);
//define the 1:N relationship
//db.proposta.hasMany(db.candidatura); // tutorialId is added into Comment model as FK
//db.candidatura.belongsTo(db.proposta);
>>>>>>> c5767d56fe3f82a4e85d0ce66ac2db148316e204

module.exports = db;