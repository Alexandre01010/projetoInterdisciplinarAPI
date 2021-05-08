// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("forum", { 
        id_forum: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        titulo: {
            type: DataTypes.STRING,
            allowNull: false //adds NOT NULL to the column
            
        },
        id_proposta: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        data_hora: {
            type: DataTypes.DATE,
            allowNull: true
        },
        gostos: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        texto: {
            type: DataTypes.TEXT,
            allowNull: false
        }
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"forum"
    });
    return Forum;
};