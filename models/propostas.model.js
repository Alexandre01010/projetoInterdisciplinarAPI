// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
  const Tutorial = sequelize.define("tutorial", {
    title: {
      type: DataTypes.STRING,
      allowNull: false //adds NOT NULL to the column
    },
    description: {
      type: DataTypes.STRING
    },
    published: {
      type: DataTypes.BOOLEAN
    }
  }, {
    timestamps: false
  });
  return Tutorial;
};
