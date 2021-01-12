const express = require('express');

//Esto valida que el usuario este autenticado para poder crear una categoria
let { verificaToken, verificaAdmin_Role } = require('../middlewares/autenticacion');

let app = express();

//Importacion de la entidad categoria
let Categoria = require('../models/categoria');


//===========================================
// Creacion de servicios de Categoria
//===========================================

//===========================================
// Se visualizan todas las categorias
//===========================================
app.get('/categoria', verificaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Categoria.find({})
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .skip(desde)
        .limit(limite)
        .exec((err, categorias) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            };

            res.json({
                ok: true,
                categorias
            });
        });
});

//===========================================
// Muestra una categoria por ID
//===========================================
app.get('/categoria/:id', verificaToken, (req, res) => {

    let id = req.params.id;

    Categoria.findById(id, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'No se encuentra categoria asociada a este ID'
                }
            })
        };
        res.json({
            ok: true,
            categoria: categoriaDB
        })
    }).populate('usuario', 'nombre email');
});

//===========================================
// Crea una nueva categoria
//===========================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        usuario: req.usuario._id,
        descripcion: body.descripcion
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        })
    });
});
//===========================================
// Actualiza una categoria de acuerdo al ID 
//===========================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;
    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true, context: 'query' }, (err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };
        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        };

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

//===========================================
// Elimina una categoria de BD  
//===========================================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role], (req, res) => {
    let id = req.params.id;
    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'El id no existe'
                }
            });
        };

        res.json({
            ok: true,
            message: 'Categoria Borrada'
        });
    })
});
module.exports = app;