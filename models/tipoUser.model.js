module.exports = (sequelize, DataTypes) =>{
    const userType = sequelize.define("tipo user",{
        id_tipo_user:{
            type:DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
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