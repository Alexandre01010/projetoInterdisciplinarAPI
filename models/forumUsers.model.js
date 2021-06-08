// This is a N:M model of Entrevista:User
module.exports = (sequelize, DataTypes) => {
    const ForumUser = sequelize.define("forum user", { 
        id_forum:{
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
        tableName:"forum user"
    });
    return ForumUser;
};