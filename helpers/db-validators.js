const Role = require('../models/role.model');
const UserModel = require('../models/user.model');

const isValidRole = async(role = '') => {
    const isExistRole = await Role.findOne({ role });
    if(!isExistRole) throw new Error(`El rol ${ role } no está registrado en la BD`);
};

const isValidEmail = async(email = '') => {
    const isExistEmail = await UserModel.findOne({ email });
    if(isExistEmail) throw new Error(`El correo ${ email } se encuentra registrado`);
}

const isValidIDUser = async(id = '') => {
    const isExistIDUser = await UserModel.findById(id);
    if(!isExistIDUser) throw new Error(`El ID (${ id }) no existe`); 
}

module.exports = {
    isValidRole,
    isValidEmail,
    isValidIDUser
}
