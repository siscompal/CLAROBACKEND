'use strict'

exports.isMayorista = function(req, res, next) {
    if (req.user.role != 'CLI_MAYORISTA') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};