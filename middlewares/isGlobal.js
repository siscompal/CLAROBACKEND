'use strict'

exports.isGlobal = function(req, res, next) {
    // Acceso todos los usuarios excepto auditores y clientes
    console.log("ROLE DE USUARIO: ", req.user.role);
    if (req.user.role == 'ROLE_AUDITOR' || req.user.role == 'CLI_CLIENTE') {
        return res.status(200).send({ message: 'Acceso restringido' });

    }
    next();
};