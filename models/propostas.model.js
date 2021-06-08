// use the exports object as a function instead of an object
module.exports = (sequelize, DataTypes) => {
  const Proposta = sequelize.define("proposta", {
    id_proposta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    objetivos: {
      type: DataTypes.STRING,
      allowNull: false
    },
    resultados_esperados:{
      type: DataTypes.STRING,
      allowNull: false
    },
    outros_dados:{
      type: DataTypes.STRING,
      allowNull: false
    },
    plano_provisorio_trabalho:{
      type: DataTypes.STRING,
      allowNull: false
    },
    perfil_candidato_desejado:{
      type: DataTypes.STRING,
      allowNull: false
    },
    nome_tutor:{
      type: DataTypes.STRING,
      allowNull: true
    },
    cargo_tutor:{
      type: DataTypes.STRING,
      allowNull: true
    },
    contato:{
      type: DataTypes.INTEGER,
      allowNull: true
    },
    recursos_necessarios:{
      type: DataTypes.STRING,
      allowNull: false
    },
    id_prof_orientador:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_user_autor:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    id_tipo_estado:{
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nome_entidade:{
      type: DataTypes.STRING,
      allowNull: true
    },
    morada_entidade:{
      type: DataTypes.STRING,
      allowNull: true
    },
    codigo_postal:{
      type: DataTypes.STRING,
      allowNull: true
    },
    email:{
      type: DataTypes.STRING,
      allowNull: true
    },
    msgRevisao:{
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    timestamps: false,
    freezeTableName: true
  });
  return Proposta;
};
