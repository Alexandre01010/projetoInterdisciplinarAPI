// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Entrevista = sequelize.define("entrevista", { 
        id_agenda: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        id_user:{
            type: DataTypes.INTEGER
        },
        data_hora:{
            type:DataTypes.DATE
        },
        id_tipo_estado:{
            type: DataTypes.INTEGER
        },
        texto_agenda:{
            type: DataTypes.TEXT
        }
        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"agenda"
    });
    return Entrevista;
};