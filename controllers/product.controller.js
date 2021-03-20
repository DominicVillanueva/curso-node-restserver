const { response, request } = require("express");
const { ProductModel } = require('../models');
const { ObjectId } = require('mongoose').Types;

const getProducts = async(req = request, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const pipeline = [
        { $match: query },
        {
            $lookup: {
                from: 'categories',
                let: { category_id: '$category' },
                pipeline: [
                    {$match: {$expr: {$eq: ['$_id', '$$category_id']}}},
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ],
                as: 'category',
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { user_id: '$user' },
                pipeline: [
                    {$match: { $expr: { $eq: ['$_id', '$$user_id'] } }},
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ],
                as: 'user', 
            },
        }, { $unset: "__v", }
    ];

    const [total, products] = await Promise.all([
        ProductModel.countDocuments(query).lean(),
        ProductModel.aggregate(pipeline) // 110ms
                    // .populate(populateQuery) 225ms
                    .skip(Number(from))
                    .limit(Number(limit)),
    ]);

    res.json({
        total,
        products,
    })
}

const getProductByID = async(req = request, res = response) => {
    const { id } = req.params;

    // 220 ms
    const pipeline = [
        { $match: { '_id': ObjectId(id)}},
        {
            $lookup: {
                from: 'categories',
                let: { category_id: '$category' },
                pipeline: [
                    {$match: {$expr: {$eq: ['$_id', '$$category_id']}}},
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ],
                as: 'category',
            },
        },
        {
            $lookup: {
                from: 'users',
                let: { user_id: '$user' },
                pipeline: [
                    {$match: { $expr: { $eq: ['$_id', '$$user_id'] } }},
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                        }
                    }
                ],
                as: 'user', 
            },
        },
        {
            $unset: "__v",
        }
    ];
    const product = await ProductModel.aggregate(pipeline);
    res.json(product);

}

const addProduct = async(req = request, res = response) => {
    const { status, user, ...product } = req.body;
    const productDB = await ProductModel.findOne({ name: product.name }).lean();

    if(productDB) {
        return res.status(400).json({
            msg: `El producto con el nombre ${ product.name }, ya existe`,
        });
    }
    product.user = req.user._id;
    product.name = product.name.toUpperCase();

    // GUARDAR DB
    const newProduct = new ProductModel(product);
    await newProduct.save();

    res.status(201).json({product});
}

const updateProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const {_id, status, ...product } = req.body;

    if(product.name) {
        product.name = product.name.toUpperCase();
    }
    product.user = req.user._id;
    const productUpdate = await ProductModel.findByIdAndUpdate(id, product, { new: true }).lean();

    res.json(productUpdate);
};

const deleteProduct = async(req = request, res = response) => {
    const { id } = req.params;
    const productRemove = await ProductModel.findByIdAndUpdate(id, { status: false }, { new: true }).lean();
    res.json(productRemove);
};

module.exports = {
    addProduct,
    getProducts,
    getProductByID,
    updateProduct,
    deleteProduct,
}
