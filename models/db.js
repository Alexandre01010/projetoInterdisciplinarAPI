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
db.resposta = require("./respostas.model.js")(sequelize, DataTypes);
db.user = require("./users.model.js")(sequelize, DataTypes);
db.forum = require("./foruns.model.js")(sequelize, DataTypes);
//db.foruns.belongsTo(db.propostas);
db.candidatura = require("./candidaturas.model.js")(sequelize, DataTypes);
db.tema = require("./temas.model.js")(sequelize, DataTypes);
db.typeUser = require("./tipoUser.model.js")(sequelize, DataTypes)
db.notificacao = require("./notificacoes.model.js")(sequelize, DataTypes)
//relation n:m between user and proposal, that results on candidaturas table
db.user.belongsToMany(db.proposta, { through: db.candidatura, foreignKey: 'id_user', otherKey: 'id_proposta'})
db.proposta.belongsToMany(db.user, { through: db.candidatura, foreignKey: 'id_proposta', otherKey: 'id_user'})

//entrevitas relations commenting this inorder to test just the entrevistas
db.participante = require("./participantes.model.js")(sequelize, DataTypes);
db.forumUser = require('./forumUsers.model.js')(sequelize, DataTypes);
// n:m entrevista:user 
db.entrevista = require("./entrevistas.model.js")(sequelize, DataTypes);
db.entrevista.belongsToMany(db.user ,{through: db.participante, foreignKey: 'id_agenda', otherKey: 'id_user'})
db.user.belongsToMany(db.entrevista ,{through: db.participante, foreignKey: 'id_user', otherKey: 'id_agenda'})

db.forum.belongsToMany(db.user, { through: db.forumUser, foreignKey: 'id_forum', otherKey: 'id_user' })
db.user.belongsToMany(db.forum, { through: db.forumUser, foreignKey: 'id_user', otherKey: 'id_forum' })
//1:n
db.entrevista.belongsTo(db.user, {as:'creator' ,foreignKey: 'id_user'})

//db.user.belongsTo(db.typeUser, {foreignKey: 'id_tipo_user'})
//db.typeUser.hasMany(db.user)




// db.user.belongsTo(db.typeUser, {foreignKey: 'id_tipo_user'})
// db.typeUser.hasMany(db.user)





module.exports = db;