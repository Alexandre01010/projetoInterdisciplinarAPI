const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/auth.config.js");
const db = require('../models/db.js')
const User = db.user;

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
            password:  bcrypt.hashSync(req.body.password, 8), // generates hash to password
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
        if (!user) return res.status(404).json({ message: "Utilizador não encontrado" });
        const passwordIsValid = bcrypt.compareSync(
            req.body.password, user.password
        );
        if (!passwordIsValid) {
            return res.status(401).json({
                accessToken: null, message: "Invalid Password!"
            });
        }
        const token = jwt.sign({ id: user.id_user }, config.secret, {
            expiresIn: 86400 // 24 hours
        });
        return res.status(200).json({
            username: user.nome, role: user.id_tipo_user,
            email: user.email, id: user.id_user , accessToken: token
        });
    } catch (err) { res.status(500).json({ message: err.message }); };
};

exports.verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"]
    if(!token){
        return res.status(403).json({
            message: "No token provided"
        })
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if(err){
            return res.status(401).json({
                message: "Unauthorized"
            })
        }
        req.loggedUserId = decoded.id
        next()
    })
}

exports.isAdmin = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId)
    let role = await user.id_tipo_user
    if(role == 1){
        return next()
    }
    return res.status(403).send({
        message: "Require Admin role"
    })
}

exports.isAdminOrLoggedUser = async (req, res, next) => {
    let user = User.findByPk(req.loggedUserId)
    let role = user.id_tipo_user
    if(role === 1 || user.id_user == req.params.userID){
        return next()
    }
    return res.status(403).send({
        message: "Require Admin role"
    })
}

exports.isDocente = async (req, res, next) => {
    let user = User.findByPk(req.loggedUserId)
    let role = user.id_tipo_user
    if(role === 2 || role === 1){
        return next()
    }
    res.status(403).send({
        message: "Unauthorized"
    })
}
exports.isStudent = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId)
    let role = await user.id_tipo_user
    if(role === 3 || role === 1){
        return next()
    }
    return res.status(403).send({
        message: "Unauthorized"
    })
}

exports.isOnlyStudent = async (req, res, next) => {
    let user = await User.findByPk(req.loggedUserId)
    let role = await user.id_tipo_user
    if(role === 3){
        return next()
    }
    return res.status(403).send({
        message: "Unauthorized"
    })
}

exports.isExternalEntity = async (req, res, next) => {
    let user = User.findByPk(req.loggedUserId)
    let role = user.id_tipo_user
    if(role === 4 || role === 1){
        return next()
    }
    return res.status(403).send({
        message: "Unauthorized"
    })
}