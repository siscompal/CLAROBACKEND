var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RecargaSchema = Schema({
    numero: { type: String, required: true },
    monto: { type: String, required: true },
    producto: { type: String, required: true },
    //producto: { type: Schema.ObjectId, ref: 'Product' },
    respuesta: { type: String, required: true },
    fec_cre: { type: Date, default: Date.now() },
    fec_upd: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Recarga', RecargaSchema);