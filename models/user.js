'use strict'
var mongoose = require(mongoose);
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    identificacion: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    cel: { type: String, required: true },
    fec_creacion: { type: Date, required: true },
    fec_update: { type: Date, required: true },
    status: { type: Boolean, required: true },
    role: {
        type: String,
        enum: ['ROLE_ADMIN,ROLE_ASESOR, ROLE_CARGAS'],
        required: true
    }

});

module.exports = mongoose.model('User', UserSchema);