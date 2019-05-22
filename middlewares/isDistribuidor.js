'use strict'

exports.isDistribuidor = function(req, res, next) {
    if (req.user.role != 'CLI_DISTRIBUIDOR') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};