'use strict'

exports.isCliadmin = function(req, res, next) {
    // Acceso solo a admin, mayorista y distribuidor
    console.log("ROLE DE USUARIO: ", req.user.role);
    if (req.user.role == 'ROLE_ASESOR' || req.user.role == 'ROLE_CARGAS' || req.user.role == 'CLI_CLIENTE') {
        return res.status(200).send({ message: 'Acceso restringido' });

    }
    next();
};