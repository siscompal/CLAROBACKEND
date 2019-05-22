'use strict'

exports.isAsesor = function(req, res, next) {
    if (req.user.role != 'ROLE_ASESOR') {
        return res.status(200).send({ message: 'Acceso restringido' });
    }
    next();
};