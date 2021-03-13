const { request, response } = require("express")

const isAdminRole = (req = request, res = response, next) => {
    if(!req.user) {
        return res.status(500).json({
            msg: 'Algó salio mal en la verificación del token',
        });
    }

    const { role, name } = req.user;
    if(role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${ name } no es administrador`
        });
    };

    next();
}

const isExistRole = (...roles) => {
    return (req = request, res = response, next) => {
        
        if(!req.user) {
            return res.status(500).json({
                msg: 'Algó salio mal en la verificación del token',
            });
        }

        if(!roles.includes(req.user.role)) {
            return res.status(401).json({
                msg: `Roles permitidos ${roles}`,
            });
        }

        console.log(roles);
        next();
    };
}

module.exports = {
    isAdminRole,
    isExistRole,
}
