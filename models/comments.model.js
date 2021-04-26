module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define("comment", {
        author: DataTypes.STRING,
        text: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: { notNull: { msg: "Text can not be empty!" } }
        }
    }, {
        timestamps: false
    });
    return Comment;
};