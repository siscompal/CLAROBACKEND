var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaldoSchema = Schema({
    valor: { type: Number, required: true }, //primera bolsa
    fec_cre: { type: Date, required: Date.now() },
    obs: { type: String, required: true },
    comision: { type: Number, required: true }, //segunda bolsa
    cliente: { type: Schema.ObjectId, ref: 'Client' },
    incentivo: { type: number } //tercera bolsa


});

module.exports = mongoose.model('Saldo', SaldoSchema);