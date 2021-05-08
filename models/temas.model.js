// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Tema = sequelize.define("tema", { 
        id_tema: {
            type: DataTypes.INTEGER,
            primaryKey: true
            
        },
        id_forum: {
            type: DataTypes.INTEGER,
            allowNull: true //adds NOT NULL to the column
        },
        id_user: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        titulo: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"tema"
    });
    return Tema;
};