'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = Schema({
    name: { type: String, required: true },
    lastname: { type: String, required: true },
    iden: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    cel: { type: String, required: true },
    fec_cre: { type: Date },
    fec_upd: { type: Date },
    status: { type: Boolean, required: true },
    role: {
        type: String,
        enum: ['ROLE_ROOT', 'ROLE_ADMIN', 'ROLE_ASESOR', 'ROLE_CARGAS', 'ROLE_CLIENTE'],
        required: true
    }

});

module.exports = mongoose.model('User', UserSchema);