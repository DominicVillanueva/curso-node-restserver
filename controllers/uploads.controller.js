const path = require('path');
const fs = require('fs');

const cloudinary = require('cloudinary').v2;

// Config user
cloudinary.config(process.env.CLOUDINARY_URL);

const { response, request } = require("express");
const { uploadFile } = require("../helpers");

const { UserModel, ProductModel } = require('../models');

const loadFile = async (req = request, res = response) => {

    try {
        // const name = await uploadFile(req.files, ['txt', 'md'], 'texts');
        const name = await uploadFile(req.files, undefined, 'img');
        res.json({ name });
    } catch (error) {
        res.status(400).json({ error })
    }
}

const updateImage = async(req = request, res = response) => {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await UserModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            model = await ProductModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar la colección' });
    }

    // Clean up images added in server
    if(model.img) {
        // Remove img from server
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if(fs.existsSync(pathImage)) {
           fs.unlinkSync(pathImage);
        }
    }

    const nameFile = await uploadFile(req.files, undefined, collection);
    model.img = nameFile;
    await model.save();

    res.json(model);
}

const showImage = async (req, res = response) => {
    
    const { id, collection } = req.params;

    let model;

    switch (collection) {
        case 'users':
            model = await UserModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            model = await ProductModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar la colección' });
    }

    // Clean up images added in server
    if(model.img) {
        // Remove img from server
        const pathImage = path.join(__dirname, '../uploads', collection, model.img);
        if(fs.existsSync(pathImage)) {
           return res.sendFile( pathImage );
        }
    }

    const pathImageDefault = path.join(__dirname, '../assets/no-image.jpg');
    res.sendFile(pathImageDefault);
};

const updateImageCloudinary = async(req = request, res = response) => {
    const { collection, id } = req.params;
    let model;

    switch (collection) {
        case 'users':
            model = await UserModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un usuario con el id ${ id }`
                });
            }
            break;
        case 'products':
            model = await ProductModel.findById(id);
            if(!model) {
                return res.status(400).json({
                    msg: `No existe un producto con el id ${ id }`
                });
            }
            break;
    
        default:
            return res.status(500).json({ msg: 'Se me olvidó validar la colección' });
    }

    // Clean up images added in server
    if(model.img) {
        // Remove img from cloudinary
        const nameToArray = model.img.split('/');
        const name = nameToArray[nameToArray.length - 1];
        const [ public_id ] = name.split('.');
        cloudinary.uploader.destroy(public_id);
    }

    const { tempFilePath } = req.files.file;
    const { secure_url } = await cloudinary.uploader.upload( tempFilePath );

    model.img = secure_url;
    await model.save();

    res.json(model);
}


module.exports = {
    loadFile,
    updateImage,
    showImage,
    updateImageCloudinary
}
