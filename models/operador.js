var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OperadorSchema = Schema({
    name: { type: String, required: true },
    status: { type: Boolean, required: true },
    user: { type: Schema.ObjectId, ref: 'User' },
    fec_cre: { type: Date, default: Date.now() },
    fec_upd: { type: Date, default: Date.now() }

});

module.exports = mongoose.model('Operador', OperadorSchema);