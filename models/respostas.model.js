// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Resposta = sequelize.define("resposta", { 
        id_user: {
            type: DataTypes.INTEGER,
            primaryKey: true
            
        },
        data_hora: {
            type: DataTypes.DATE,
            allowNull: false, //adds NOT NULL to the column
            primaryKey: true
        },
        texto_resposta: {
            type: DataTypes.STRING,
            allowNull: false
        },
        id_tema: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"resposta"
    });
    return Resposta;
};