module.exports = (sequelize, DataTypes) =>{
    const Candidatura = sequelize.define("candidatura",{
        id_user:{
            type:DataTypes.INTEGER,
            primaryKey: true
        }
    })
}




// // use the exports object as a function instead of an object
// module.exports = (sequelize, DataTypes) => {
//     const Forum = sequelize.define("forum", {
//         id_forum:{
//             type:DataTypes.INTEGER,
//             primaryKey: true
//         },
//         titulo: {
//             type: DataTypes.STRING,
//             allowNull: true //adds NOT NULL to the column
//         },
//         data_hora: {
//             type: DataTypes.DATE
//         },
//         gostos: {
//             type: DataTypes.INTEGER
//         },
//         texto: {
//             type: DataTypes.TEXT
//         }
//     }, {
//         timestamps: false,
//         freezeTableName: true
//     });
//     return Forum;
// };