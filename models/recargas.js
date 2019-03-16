var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecaSchema = Schema({
    numero: { type: String, required: true },
    empresa: { type: String, required: true },
    operador: { type: String, required: true },
    monto: { type: String, required: true },
    respuesta: { type: String, required: true },
    fec_creacion: { type: Date, default: Date.now() },
    fec_update: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Recarga', RecaSchema);