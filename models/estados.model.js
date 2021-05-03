module.exports = (sequelize, DataTypes) => {
    const Estado = sequelize.define("estado", {
        id_tipo_estado: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },

        estado: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Text can not be empty!" } }
        }
    }, {
        timestamps: false,
        tableName: "tipo_estado"
    });
    return Estado;
};