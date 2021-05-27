// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nome: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      id_tipo_user: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cv: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      foto: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName:"user"
    });
    return User;
  };
  