var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProductSchema = Schema({
    name: { type: String, required: true },
    // operador: {type: Schema.ObjectId, ref: 'Operador'},
    precio: { type: Number, required: true },
    codigo: { type: Number, required: true },
    status: { type: Boolean, dafault: false },
    fec_cre: { type: Date, default: Date.now() },
    fec_upd: { type: Date, default: Date.now() },
    user: { type: Schema.ObjectId, ref: 'User' },
    incentivo: { type: Number },
    descripcion: { type: String, required: true }

});

module.exports = mongoose.model('Product', ProductSchema);