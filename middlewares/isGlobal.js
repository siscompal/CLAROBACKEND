'use strict'

exports.isGlobal = function(req, res, next) {
    if (req.user.role != 'ROLE_ASESOR' || req.user.role != 'ROLE_CARGAS' || req.user.role != 'CLI_MAYORISTA' || req.user.role != 'CLI_DISTRIBUIDOR') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};