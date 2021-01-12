const { json } = require('body-parser');
const jwt = require('jsonwebtoken');

//======================================
// Verficar token
//======================================


let verificaToken = (req, res, next) => {

    let authorization = req.get('Authorization');

    jwt.verify(authorization, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalido token de autorizacion'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


};

//======================================
// Verifica Admin_Role
//======================================
let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;

    if (usuario.role === "ADMIN_ROLE") {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }

};


//======================================
// Verifica Token Img
//======================================
let verificaTokenImg = (req, res, next) => {
    let token = req.query.token;

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalido token de autorizacion'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });


};

module.exports = {
    verificaToken,
    verificaAdmin_Role,
    verificaTokenImg
};