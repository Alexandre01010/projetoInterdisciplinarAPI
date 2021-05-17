module.exports = (sequelize, DataTypes) => {
    const Role = sequelize.define("tipo user", {
        id_tipo_user: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        tipo_user: {
            type: DataTypes.STRING
        }
    }, {
        timestamps: false
    });

    return Role
};