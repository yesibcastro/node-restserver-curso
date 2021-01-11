const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [
            true, 'La descripcion de la categoria es necesaria'
        ]
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

//Validacion de campos unicos
categoriaSchema.plugin(uniqueValidator, {
    message: '{PATH} debe de ser unico'
});

module.exports = mongoose.model('Categoria', categoriaSchema);