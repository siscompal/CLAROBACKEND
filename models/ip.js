var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var IpSchema = Schema({
    ip: { type: String, required: true },
    conteo: { type: Number, required: true }
    // Agregar date 
    // fec_cre: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('IpBlack', IpSchema);