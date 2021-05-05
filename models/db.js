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
db.user = require("./users.model.js")(sequelize, DataTypes);
db.forum = require("./foruns.model.js")(sequelize, DataTypes);
//db.foruns.belongsTo(db.propostas);
db.candidatura = require("./candidaturas.model.js")(sequelize, DataTypes);
db.tema = require("./temas.model.js")(sequelize, DataTypes);
//define the 1:N relationship
//db.proposta.hasMany(db.candidatura); // tutorialId is added into Comment model as FK
//db.candidatura.belongsTo(db.proposta);
//db.foruns.belongsTo(db.user)

//entre propostas e usaers belongtoMany
//foreign key here


db.user.belongsToMany(db.proposta, { through: db.candidatura, foreignKey: 'id_user', otherKey: 'id_proposta'})
db.proposta.belongsToMany(db.user, { through: db.candidatura, foreignKey: 'id_proposta', otherKey: 'id_user'})



// db.user.belongsToMany(db.proposta, { through: db.candidatura})
// db.proposta.belongsToMany(db.user, { through: db.candidatura})




// db.candidatura.hasOne(db.proposta)
// db.proposta.hasMany(db.candidatura)

//entrevitas relations commenting this inorder to test just the entrevistas
db.entrevista = require("./entrevistas.model.js")(sequelize, DataTypes);




module.exports = db;