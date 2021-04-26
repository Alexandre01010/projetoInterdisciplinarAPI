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
    resultados_esperados:{
      type: DataTypes.STRING
    },
    outros_dados:{
      type: DataTypes.STRING
    },
    plano_provisorio_trabalho:{
      type: DataTypes.STRING
    },
    perfil_candidato_desejado:{
      type: DataTypes.STRING
    },
    nome_tutor:{
      type: DataTypes.STRING
    },
    cargo_tutor:{
      type: DataTypes.STRING
    },
    contato:{
      type: DataTypes.INTEGER
    },
    recursos_necessario:{
      type: DataTypes.STRING
    }

  }, {
    timestamps: false
  });
  return Proposta;
};
