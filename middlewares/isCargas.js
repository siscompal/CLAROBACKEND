'use strict'

exports.isCargas = function(req, res, next) {
    if (req.user.role != 'ROLE_CARGAS') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};