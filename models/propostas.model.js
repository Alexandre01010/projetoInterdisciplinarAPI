// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
  const Proposta = sequelize.define("proposta", {
    id_proposta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
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
    recursos_necessarios:{
      type: DataTypes.STRING
    },
    id_prof_orientador:{
      type: DataTypes.INTEGER
    },
    id_user_autor:{
      type: DataTypes.INTEGER
    },
    id_tipo_estado:{
      type: DataTypes.INTEGER
    },
    nome_entidade:{
      type: DataTypes.STRING
    },
    morada_entidade:{
      type: DataTypes.STRING
    },
    codigo_postal:{
      type: DataTypes.STRING
    },
    email:{
      type: DataTypes.STRING
    },
    msgRevisao:{
      type: DataTypes.STRING
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
  return Proposta;
};
