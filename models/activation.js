var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var activationSchema = Schema({
    numero: { type: Number, required: true },
    iccid: { type: Number, required: true },
    status: { type: Boolean, dafault: false },
 
});

module.exports = mongoose.model('Activation', ProductSchema);