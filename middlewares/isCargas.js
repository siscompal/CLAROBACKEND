'use strict'

exports.isCargas = function(req, res, next) {
    // Acceso todos excepto asesores y clientes 
    console.log("ROLE DE USUARIO: ", req.user.role);
    if (req.user.role == 'ROLE_ASESOR' || req.user.role == 'CLI_CLIENTE') {
        return res.status(200).send({ message: 'Acceso restringido' });

    }
    next();
};