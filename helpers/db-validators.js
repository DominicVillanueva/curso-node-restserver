const { CategoryModel, UserModel, RoleModel, ProductModel } = require('../models');

const isValidRole = async(role = '') => {
    const isExistRole = await RoleModel.findOne({ role });
    if(!isExistRole) throw new Error(`El rol ${ role } no está registrado en la BD`);
};

const isValidEmail = async(email = '') => {
    const isExistEmail = await UserModel.findOne({ email });
    if(isExistEmail) throw new Error(`El correo ${ email } se encuentra registrado`);
}

const isValidIDUser = async(id = '') => {
    const isExistUser = await UserModel.findById(id);
    if(!isExistUser) throw new Error(`El ID (${ id }) no existe`);
    return true; 
}

const isValidIdCategory = async(id = '') => {
    const isExistCategory = await CategoryModel.findById(id);
    if(!isExistCategory) throw new Error(`El ID (${ id }) no existe`);
};

const isValidIdProduct = async(id = "") => {
    const isExistProduct = await ProductModel.findById(id);
    if(!isExistProduct) throw new Error(`El ID (${ id }) no existe`);
    return true;
};

const isExistNameProduct = async(name= '') => {
    const isValidName = await ProductModel.findOne({ name });
    if(isValidName) throw new Error(`El nombre ${ name } se encuentra registrado`);
}

/**
 * Collections Valid
 */
const allowedCollections = (nameCollection = '', collections = []) => {
    const validCollection = collections.includes(nameCollection);
    if(!validCollection) throw new Error(`La colección ${ nameCollection } no es permita, colecciones permitidas ${ collections }`);

    return  true;
}

module.exports = {
    isValidRole,
    isValidEmail,
    isValidIDUser,
    isValidIdCategory,
    isValidIdProduct,
    isExistNameProduct,
    allowedCollections,
}
