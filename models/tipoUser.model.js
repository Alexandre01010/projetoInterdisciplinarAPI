module.exports = (sequelize, DataTypes) =>{
<<<<<<< HEAD
    const userType = sequelize.define("tipo_user",{
=======
    const userType = sequelize.define("tipo user",{
>>>>>>> 16f6943781429d5e48d10c62ebdc715937ac1c49
        id_tipo_user:{
            type:DataTypes.INTEGER,
            primaryKey: true
        },
        tipo_user:{
            type:DataTypes.STRING,
        },
    },
    {
        timestamps: false,
        freezeTableName: true}
    )
    return userType;
}