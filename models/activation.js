const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activationSchema = Schema({
    id_pdv: { type: String, required: true },
    numero: { type: String, required: true },
    iccid: { type: String, required: true },
    status: { type: Boolean, dafault: false },
    fec_cre: { type: Date, default: Date.now() },
    fec_sol: { type: Date}
});

module.exports = mongoose.model('Activation', activationSchema);