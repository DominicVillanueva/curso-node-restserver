const { response, request } = require("express");
const { CategoryModel } = require('../models');

// Obtenercategorias - paginado - total - populate
const getCategories = async(req, res = response) => {
    const { limit = 5, from = 0 } = req.query;
    const query = { status: true };

    const pipeline = [
        { $match: query },
        {
            $lookup: {
                from: 'users',
                let: { user_id: '$user' },
                pipeline: [
                    { $match: { $expr: { $eq: ['$_id', '$$user_id']}}},
                    {
                        $project: {
                            _id: 1,
                            name: 1
                        }
                    }
                ],
                as: 'user'
            },
        }, { $unset: '__v' },
    ]

    const [ total, categories ] = await Promise.all([
        CategoryModel.countDocuments(query),
        CategoryModel.aggregate(pipeline)
                    .skip(Number(from))
                    .limit(Number(limit)),
    ]);

    res.json({
        total,
        categories,
    });
};

// Obtenercategoria - populate
const getCategoryById = async(req = request, res = response) => {
    const { id } = req.params;
    const category = await CategoryModel.findById(id)
                                        .populate({
                                            path: 'user',
                                            select: ['name', 'email'],
                                        });
    res.json({
        category,
    })
    
};

const createdCategory = async(req, res = response) => {
    const name = req.body.name.toUpperCase();
    const categoryDB = await CategoryModel.findOne({ name });

    if(categoryDB) {
        return res.status(400).json({
            msg: `La categoria ${ categoryDB.name }, ya existe`,
        });
    }

    // Generar la data a guardar
    const data = {
        name,
        user: req.user._id,
    }

    const category = new CategoryModel(data);
    
    // Guardar DB
    await category.save();

    res.status(201).json(category);
}

// Actualizar Categoria
const updateCategory = async(req = request, res = response) => {
    const { id } = req.params;
    const { status, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await CategoryModel.findByIdAndUpdate(id, data, { new: true }); // el valor new: true, retorna el nuevo documento actualizado
    
    res.json(category);
}

// Borrar Categoria - estado: false
const deleteCategory = async(req, res = response) => {
    const { id } = req.params;
    const category = await CategoryModel.findByIdAndUpdate(id, { status: false }, { new: true });
    res.json(category)
}

module.exports = {
    createdCategory,
    getCategories,
    getCategoryById,
    updateCategory,
    deleteCategory,
}
