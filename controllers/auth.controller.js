const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require('../models/db.js')
const User = db.user;
const Role = db.typeUser

exports.signup = async (req, res) => {
    try {
        // check duplicate username
        let user = await User.findOne(
            { where: { nome: req.body.nome } }
        );

        let userEmail = await User.findOne(
            { where: { email: req.body.email } }
        )
        if (user || userEmail) {
            if (user) {
                return res.status(400).json({ message: "Erro! Esse nome já existe" });
            }
            if (userEmail) {
                return res.status(400).json({ message: "Erro! Esse email já existe" });
            }
        }
        // save User to database
        user = await User.create({
            nome: req.body.nome,
            email: req.body.email,
            password: bcrypt.hashSync(req.body.password, 8), // generates hash to password
            id_tipo_user: req.body.id_tipo_user,
            cv: req.body.cv,
            foto: req.body.foto

        });
        return res.json({ message: "Utilizador criado com sucesso" });
    }
    catch (err) {
        res.status(500).json({ message: err.message });
    };
};

// exports.signup = (req, res) => {
//     User.create(req.body)
//       .then(data => {
//         res.status(201).json({ message: "Novo utilizador criado.", location: "/users/" + data.id_user });
//       })
//       .catch(err => {
//         if (err.name === 'SequelizeValidationError')
//           res.status(400).json({ message: err.errors[0].message });
//         else
//           res.status(500).json({
//             message: err.message || "Ocorreu um erro ao criar o utilizador"
//           });
//       });
//   }

exports.signin = async (req,res) => {
    try{
        let user = await User.findOne({ where: { email: req.body.email } })
        console.log("Bool: " + user)
        // console.log(req.body.password)
        // console.log("message: " + user.nome)
        // const passwordIsValid = bcrypt.compare(
        //     req.body.password, user.password
        // )
        //console.log("Estado da comparação: " + passwordIsValid)
        if(!user){
            return res.status(404).json({
                message: "Utilizador não existe"
            })
        }else{
            if(!passwordIsValid){
                return res.status(401).json({
                    accessToken: null, message: "Password inválida"
                })
            }
            const token = jwt.sign({ id: user.id_user }, config.secret, {
                expiresIn: 86400
            })
            return res.status(200).json({
                id: user.id_user, name: user.nome,
                email: user.email, role: user.id_tipo_user, accessToken: token
            })
        }
    }catch(err){
        res.status(500).json({
            message: err.message
        })
    }
}

// exports.signin = async (req, res) => {
//     try {
//         let user = await User.findOne({ where: { username: req.body.username } });
//         if (!user) return res.status(404).json({ message: "User Not found." });
//         // tests a string (password in body) against a hash (password in database)
//         const passwordIsValid = bcrypt.compareSync(
//             req.body.password, user.password
//         );
//         if (!passwordIsValid) {
//             return res.status(401).json({
//                 accessToken: null, message: "Invalid Password!"
//             });
//         }
//         // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
//         const token = jwt.sign({ id: user.id }, config.secret, {
//             expiresIn: 86400 // 24 hours
//         });
//         let role = await user.getRole();
//         return res.status(200).json({
//             id: user.id, username: user.username,
//             email: user.email, role: role.name.toUpperCase(), accessToken: token
//         });
//     } catch (err) { res.status(500).json({ message: err.message }); };
// };