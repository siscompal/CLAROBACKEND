'use strict'

exports.isCliente = function(req, res, next) {
    if (req.user.role != 'CLI_CLIENTE') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};