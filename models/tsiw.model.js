const sql = require("./db.js"); // get DB connection
// define TUTORIAL model constructor
const Tsiw = function (user) {
    this.id = user.id_user;
    this.username = user.nome;
    this.email = user.email;
    this.tipoDeUser = user.id_tipo_user;
    this.cv = user.cv;
    this.foto = user.foto;
    this.password = user.password;
};
// define method getAll to handle getting all Tutorials from DB
// result = "(error, data)", meaning it will return either an error message or some sort of data
Tsiw.getAllUsers = (result) =>{
    sql.query("SELECT * FROM user", (err, res) =>{
        if(err){
            result(err, null);
            return;
        }
        result(null, res);
    })
}
// EXPORT MODEL (required by CONTROLLER)
module.exports = Tsiw;