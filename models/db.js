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
db.tutorial = require("./tutorials.model.js")(sequelize, DataTypes);

db.comment = require("./comments.model.js")(sequelize, DataTypes);
//define the 1:N relationship
db.tutorial.hasMany(db.comment); // tutorialId is added into Comment model as FK
db.comment.belongsTo(db.tutorial);

module.exports = db;