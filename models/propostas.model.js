// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
  const Proposta = sequelize.define("proposta", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false //adds NOT NULL to the column
    },
    titulo: {
      type: DataTypes.STRING
    },
    objetivos: {
      type: DataTypes.STRING
    },
    
  }, {
    timestamps: false
  });
  return Proposta;
};
