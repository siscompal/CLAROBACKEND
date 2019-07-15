var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = Schema({
    status: { type: Boolean, required: true, default: true },
    imagePath: { type: String, required: true }
    // Agregar date 
    // fec_cre: {type: Date, default: Date.now()}
});

module.exports = mongoose.model('Image', ImageSchema);