// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Entrevista = sequelize.define("entrevista", { 
        id_entrevista: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        data: {
            type:  DataTypes.DATE
        },
        id_user:{
            type: DataTypes.INTEGER
        },
        tipo_estado:{
            type: DataTypes.INTEGER
        },
        desc_estado:{
            type: DataTypes.TEXT
        },
        texto_agenda:{
            type: DataTypes.TEXT
        }
        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"entrevista"
    });
    return Entrevista;
};