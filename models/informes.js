var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var InformeSchema = Schema({

    valor: { type: Number, required: true },
    fec_cre: { type: Date, required: Date.now() },
    obs: { type: String, required: true },



});

module.exports = mongoose.model('Informe', InformeSchema);