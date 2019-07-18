var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = Schema({
    imagePath: { type: String, required: true },
});

module.exports = mongoose.model('Image', ImageSchema);