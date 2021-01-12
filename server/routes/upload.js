const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
//Importar entidades
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');
const fs = require('fs');
//Constante para construir path al buscar una imagen
const path = require('path');

//opciones por defecto 
app.use(fileUpload());


app.put('/upload/:tipo/:id', (req, res) => {

    //Variable para identificar si la imagen es de usuarios o productos
    let tipo = req.params.tipo;
    //Variable para identificar el id del usuario o producto a actualizar
    let id = req.params.id;

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo.'
            }
        });
    };

    //Validar tipos 
    let tiposValidos = ['usuarios', 'productos'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos permitidos son ' + tiposValidos.join(', '),
                tipo
            }
        })

    }
    //req.files.(archivo) = la variable archivo es la misma que se envia por parametro en postman para cargar el archivo
    let archivo = req.files.archivo;
    //Variable para obtener el nombre y la extension del archivo segmentado 
    let nombreCortado = archivo.name.split('.');
    //Variable para obtener la ultima posicion del "nombreCortado"
    let extension = nombreCortado[nombreCortado.length - 1];


    //Extensiones permitidas
    let extensionesValidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extensionesValidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extensionesValidas.join(', '),
                ext: extension
            }
        });
    };

    //Cambiar nombre del archivo 
    let nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extension}`;

    //Ruta donde se subiran los archivos enviados desde postman
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        };

        //Actualizar imagen en usuario 
        if (tipo === 'usuarios') {
            imagenUsuario(id, res, nombreArchivo);
        } else {
            imagenProducto(id, res, nombreArchivo);
        }
    });
});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!usuarioDB) {
            borrarArchivo(nombreArchivo, 'usuarios');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        };

        //Borrar imagen del usuario 
        borrarArchivo(usuarioDB.img, 'usuarios');

        usuarioDB.img = nombreArchivo;

        usuarioDB.save((err, usuarioGuardado) => {

            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });

    });
};

function imagenProducto(id, res, nombreArchivo) {
    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoDB) {
            borrarArchivo(nombreArchivo, 'productos');
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Producto no existe'
                }
            });
        };

        //Borrar imagen del usuario 
        borrarArchivo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;

        productoDB.save((err, productoGuardado) => {

            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });

    });
};

function borrarArchivo(nombreImagen, tipo) {
    //verificar que la ruta de la imagen exista 
    //cada argumento del resolve son segmentos del path que se quiere construir
    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);

    //validar si ese path exista
    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }
}
module.exports = app;