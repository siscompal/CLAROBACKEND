var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SaldoSchema = Schema({
    valor: { type: Number, required: true }, //primera bolsa
    fec_cre: { type: Date, required: Date.now() },
    obs: { type: String, required: true },
    comision: { type: Number, required: true }, //segunda bolsa
    user_Origen: { type: Schema.ObjectId, ref: 'User' }, //quien asigna o debita
    client_Origen: { type: Schema.ObjectId, ref: 'Client' }, //quien asigna o debita
    cliente: { type: Schema.ObjectId, ref: 'Client' },
    tipo: { type: String, required: true },
    incentivo: { type: Number }, //tercera bolsa, lo que otorga el operador
});

module.exports = mongoose.model('Saldo', SaldoSchema);