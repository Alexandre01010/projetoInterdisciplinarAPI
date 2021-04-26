// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const Forum = sequelize.define("forum", {
        titulo: {
            type: DataTypes.STRING,
            allowNull: true //adds NOT NULL to the column
        },
        dataHora: {
            type: DataTypes.DATE
        },
        gostos: {
            type: DataTypes.INTEGER
        },
        texto: {
            type: DataTypes.TEXT    
        }
    }, {
        timestamps: false
    });
    return Forum;
};