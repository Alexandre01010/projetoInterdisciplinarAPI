// This is a N:M model of Entrevista:User
module.exports = (sequelize, DataTypes) => {
    const EntrevistaUser = sequelize.define("entrevistaUser", { 
        id_agenda:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        id_user:{
            type:DataTypes.INTEGER,
            primaryKey: true
        }
        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"agenda user"
    });
    return EntrevistaUser;
};