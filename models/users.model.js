// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("user", {
      id_user: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      nome: {
        type: DataTypes.STRING
      },
      email: {
        type: DataTypes.STRING
      },
      password:{
        type: DataTypes.STRING
      },
      id_tipo_user:{
        type: DataTypes.INTEGER,
      },
      cv:{
        type: DataTypes.TEXT,
      },
      foto:{
        type: DataTypes.STRING,
      }
    }, {
      timestamps: false,
      tableName:"user"
    });
    return User;
  };
  