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

// exports.signin = async (req, res) => {
//     try {
//         let user = await User.findOne({ where: { email: req.body.email } })
//         if (!user) {
//             return res.status(404).json({ message: "Utilizador não encontrado" })
//         }
//         const isPasswordValid = bcrypt.compareSync(
//             req.body.password, user.password
//         )
//         if (!isPasswordValid) {
//             return res.status(404).json({ message: "Password inválida" })
//         }
//         const token = jwt.sign({ id: user.id_user }, config.secret, {
//             expiresIn: 86400
//         })
//         return res.status(200).json({
//             id: user.id_user, username: user.nome, email: user.email, accessToken: token
//         })

//     } catch (err) {
//         res.status(500).json({ message: err.message })
//     }
// }

exports.signin = async (req, res) => {
    try {
        let user = await User.findOne({ where: { email: req.body.email } });
        if (!user) return res.status(404).json({ message: "User Not found." });
        //console.log(bcrypt.hashSync(req.body.password))
        console.log(user.password)
        // tests a string (password in body) against a hash (password in database)
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );
        console.log("dsfsdfsd " + passwordIsValid)
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
        }
        // sign the given payload (user ID) into a JWT payload – builds JWT token, using secret key
        const token = jwt.sign({ id: user.id_user }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        return res.status(200).json({
            id: user.id_user, username: user.nome,
            email: user.email, accessToken: token
        });
    } catch (err) { res.status(500).json({ message: err.message }); };
};