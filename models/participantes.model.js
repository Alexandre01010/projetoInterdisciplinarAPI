// This is a N:M model of Entrevista:User
module.exports = (sequelize, DataTypes) => {
    const EntrevistaUser = sequelize.define("entrevistaUser", { 
        id_agenda: {
            type: DataTypes.INTEGER,
            references: {
                model: 'agenda', // 'Actors' would also work
                key: 'id_agenda'
            }
        },
        id_user: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user', // 'Movies' would also work
                key: 'id_user'
            }
        }
        
    }, {
        timestamps: false,
        //freezeTableName: true,
        tableName:"agenda user"
    });
    return EntrevistaUser;
};