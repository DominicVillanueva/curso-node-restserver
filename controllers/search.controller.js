const { response, request } = require("express");
const { ObjectId } = require('mongoose').Types;

const { UserModel, CategoryModel, ProductModel } = require('../models');

const collectionsAllowed = [
    'users',
    'categories',
    'products',
    'roles'
];

const searchUsers = async(term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term); // TRUE
    if(isMongoID) {
        const user = await UserModel.findById(term).lean();
        return res.json({
            results: (user) ? [user] : []
        });
    }

    const rgx = new RegExp(term, 'i');
    const users = await UserModel.find({
        $or: [{ name: rgx }, { email: rgx}],
        $and: [{ status: true }]
    }).lean();

    res.json({
        results: users
    })
};

const searchCategories = async(term = '', res = response) => {
    const isMongoID = ObjectId.isValid(term);
    if(isMongoID) {
        const category = await CategoryModel.findById(term)
                                            .populate('user', 'name')
                                            .lean();
        return res.json({
            results: (category) ? [category] : [],
        });
    }

    const rgx = new RegExp(term, 'i');
    const categories = await CategoryModel.find({ name: rgx, status: true })
                                        .populate('user', 'name')
                                        .lean();

    res.json({
        results: categories,
    });
};

const searchProducts = async(term = '', res = response) => {
    const isMongoID = ObjectId(term);
    if(isMongoID) {
        const product = await ProductModel.findById(term)
                                        .populate('category', 'name')
                                        .populate('user', 'name')
                                        .lean();
        return res.json({
            results: (product) ? [product] : [],
        });
    }

    const rgx = new RegExp(term, 'i');
    const products = await ProductModel.find({ name: rgx, status: true })
                                    .populate('category', 'name')
                                    .populate('user', 'name')
                                    .lean();

    res.json({
        results: products,
    })
};

const search = async(req = request, res = response) => {
    const { collection, term } = req.params;

    if(!collectionsAllowed.includes(collection)) {
        return res.status(400).json({
            msg: `Las colecciones disponibles son: ${ collectionsAllowed }`,
        });
    }

    switch (collection) {
        case 'users':
            searchUsers(term, res);
            break;
        case 'categories':
            searchCategories(term, res);
            break;
        case 'products':
            searchProducts(term, res);
            break;
        default:
            res.status(500).json({
                msg: 'Se me olvido hacer esta búsqueda.'
            });
            break;
    }
}

module.exports = {
    search,
}
