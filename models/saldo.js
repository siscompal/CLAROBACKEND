var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaldoSchema = Schema({
    valor: { type: Number, required: true }, //primera bolsa
    fec_cre: { type: Date, required: Date.now() },
    obs: { type: String, required: true },
    comision: { type: Number, required: true }, //segunda bolsa
    // comision_actual: { type: Number, required: true },
    cliente: { type: Schema.ObjectId, ref: 'Client' },
    incentivo: { type: Number }, //tercera bolsa, lo que otorga el operador
    // incentivo_actual: { type: Number, required: true },


});

module.exports = mongoose.model('Saldo', SaldoSchema);