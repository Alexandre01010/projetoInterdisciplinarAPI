// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Notificacao = sequelize.define("notificacao", { 
        id_notificacao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: true //adds NOT NULL to the column
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        id_tipo_estado: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"notificacao"
    });
    return Notificacao;
};