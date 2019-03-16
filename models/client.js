var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ClienteSchema = Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    identificacion: { type: String, required: true },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    city: { type: String, required: true },
    dir: { type: String, required: true },
    cel: { type: Number, required: true },
    porcentaje: { type: Number, required: true },
    efecty: { type: Boolean, default: false },
    status: { type: Boolean, required: true },
    fec_crecion: { type: Date, default: Date.now() },
    fec_update: { type: Date, default: Date.now() },
    user: { type: Schema.ObjectId, ref: 'User' },
    rol: {
        type: String,
        enum: ['CLI_MAYORISTA', 'CLI_DISTRIBUIDOR', 'CLI_CLIENTE'],
        required: true
    },


});

module.exports = mongoose.model('Cliente', ClienteSchema);