var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaldoSchema = Schema({
    valor: { type: Number, required: true },
    fec_creacion: { type: Date, required: Date.now() },
    obs: { type: String, required: true },
    comision: { type: Number, required: true },
    cliente: { type: Schema.ObjectId, ref: 'Cliente' },
    incentivo: { type: number }


});

module.exports = mongoose.model('Saldo', SaldoSchema);