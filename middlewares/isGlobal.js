'use strict'

exports.isGlobal = function(req, res, next) {
    console.log("ROLE DE USUARIO QUE CREA: ", req.user.role);
    if (req.user.role == 'ROLE_AUDITOR' || req.user.role == 'CLI_CLIENTE') {
        return res.status(200).send({ message: 'Acceso restringido' });

    }
    next();
};