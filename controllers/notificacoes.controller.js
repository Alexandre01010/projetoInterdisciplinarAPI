const db = require("../models/db.js");
const Notificacao = db.notificacao;

const { Op } = require("sequelize");
const { notificacao } = require("../models/db.js");

exports.createNotification = (req, res) => {
    // Save Tutorial in the database
    Notificacao.create(req.body)
        .then(data => {
            res.status(201).json({ message: "Nova notificação criada", location: "/notificacoes/" + data.id_notificacao });
        })
        .catch(err => {
            if (err.name === 'SequelizeValidationError')
                res.status(400).json({ message: err.errors[0].message });
            else
                res.status(500).json({
                    message: err.message || "Ocorreu um erro ao criar a notificação."
                });
        });
};

exports.editNotification = (req, res) => {
    if (!req.body) {
        res.status(400).json({ message: "O corpo do pedido não pode estar vazio!" });
        return;
    }
    Notificacao.findByPk(req.params.notificationID)
        .then(notificacao => {
            if (notificacao === null)
                res.status(404).json({
                    message: `Não foi encontrada a notificação com o id ${req.params.notificationID}.`
                });
            else {
                Notificacao.update(req.body, { where: { id_notificacao: req.params.notificationID } })
                    .then(num => {
                        if (num == 1) {
                            res.status(200).json({
                                message: `A notificação com o id=${req.params.notificationID} foi atualizada com sucesso.`
                            });
                        } else {
                            res.status(200).json({
                                message: `Não foram feitas nenhumas alterações na notificação com id=${req.params.notificationID}.`
                            });
                        }
                    })
            }
        })
        .catch(err => {
            res.status(500).json({
                message: `Ocorreu um erro ao atualizar a notificação com id=${req.params.notificationID}.`
            });
        });
};

exports.findNotificationsFiltered = (req, res) => {
    if (req.query.userID || req.query.stateID) {
        Notificacao.findAll({ where: { id_user: req.query.userID ,
                              id_tipo_estado: req.query.stateID}})
            .then(data => {
                res.status(200).json(data);
            })
            .catch(err => {
                res.status(500).json({
                    message:
                        err.message || "Ocorreu um erro ao encontrar notificações"
                });
            });
    }
    else {
        Notificacao.findAll(req.body)
            .then(data => {
                res.status(200).json(data);
            })
            .catch((err) => {
                res.status(500).json({
                    message:
                        err.message || "Ocorreu um erro ao encontrar notificações",
                });
            });
    }
}