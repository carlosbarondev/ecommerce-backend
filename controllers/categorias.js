const mongoose = require('mongoose');
const { response } = require("express");
const { Categoria, Subcategoria } = require('../models/categoria');
const { Types: { ObjectId } } = mongoose;


const obtenerCategorias = async (req = request, res = response) => {

    const { desde = 0, limite = 50, visibles = `{ "estado": "true" }`, ordenar = "-vendidos" } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(JSON.parse(visibles)),
        Categoria.find(JSON.parse(visibles))
            .sort(ordenar)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate({
                path: 'subcategorias',
                match: { "estado": true }
            })
    ]);

    res.json({
        total,
        categorias
    });
}

const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { visibles = ['true', 'false'] } = req.query;

    let query;

    if (mongoose.isValidObjectId(id)) { // El id puede ser un id de Mongo o el nombre de la categoria
        query = { "_id": id }
    } else {
        query = { "nombre": id }
    }

    const categoria = await Categoria.findOne(query)
        .collation({ locale: "es", strength: 1 })
        .populate({
            path: 'subcategorias',
            match: { "estado": { $in: visibles } }
        });

    res.json({
        categoria
    });
}

const obtenerSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    let query;

    // El id puede ser un nombre de subcategoría o un id de Mongo
    const validateObjectId = (id) => ObjectId.isValid(id) && (new ObjectId(id)).toString() === id;

    if (validateObjectId) {
        query = { "nombre": id, "estado": true }
    } else {
        query = { "_id": id, "estado": true }
    }

    const subcategoria = await Subcategoria.findOne(query)
        .collation({ locale: "es", strength: 1 })
        .populate({
            path: 'productos', match: { "estado": true },
            populate: { path: 'categoria subcategoria', match: { "estado": true } },
        })

    res.json({
        subcategoria
    });
}

const crearCategoria = async (req, res = response) => {

    const { nombre, img } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    const categoria = new Categoria({ nombre, img });

    // Guardar Categoria en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}

const crearSubCategoria = async (req, res = response) => {

    const { idCategoria, nombre, img } = req.body;

    const subcategoriaDB = await Subcategoria.findOne({ nombre: nombre });

    if (subcategoriaDB) {
        return res.status(400).json({
            msg: `La subcategoria ${subcategoriaDB.nombre} ya existe`
        });
    }

    const subcategoria = new Subcategoria({ nombre, img });

    // Guardar Categoria en la base de datos
    await subcategoria.save();

    const categoria = await Categoria.findByIdAndUpdate(idCategoria, { "$push": { "subcategorias": subcategoria._id } }, { new: true })
        .populate("subcategorias");

    res.status(201).json({
        subcategoria,
        categoria
    });

}

const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, subcategorias, estado } = req.body;

    // Si recibe el nombre se actualiza el nombre y estado de la Categoria
    const categoria = await Categoria.findByIdAndUpdate(id, { "nombre": nombre, "estado": estado }, { new: true })
        .populate("subcategorias");

    res.json(
        categoria
    );
}

const actualizarSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, estado } = req.body;

    // Si recibe el nombre se actualiza el nombre y estado de la Categoria
    const subcategoria = await Subcategoria.findByIdAndUpdate(id, { "nombre": nombre, "estado": estado }, { new: true });

    res.json(
        subcategoria
    );
}

// borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    // // Borrado fisico

    // const categoria = await Categoria.findById(id);

    // // Borrar Subcategorias de la Categoria

    // for (const sub of categoria.subcategorias) {
    //     await Subcategoria.findByIdAndDelete(sub._id);
    // }

    // // Borrar la Categoria
    // const categoriaBorrada = await Categoria.findByIdAndDelete(id);

    // Borrado lógico

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true })
        .populate("subcategorias");

    res.json(
        categoriaBorrada
    );
}

const borrarSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    // // Borrado fisico

    // const categoria = await Categoria.findById(id);

    // // Borrar Subcategorias de la Categoria

    // for (const sub of categoria.subcategorias) {
    //     await Subcategoria.findByIdAndDelete(sub._id);
    // }

    // // Borrar la Categoria
    // const categoriaBorrada = await Categoria.findByIdAndDelete(id);

    // Borrado lógico

    const subcategoriaBorrada = await Subcategoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json(
        subcategoriaBorrada
    );
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    obtenerSubCategoria,
    crearCategoria,
    crearSubCategoria,
    actualizarCategoria,
    actualizarSubCategoria,
    borrarCategoria,
    borrarSubCategoria
}