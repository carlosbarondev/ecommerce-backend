const mongoose = require('mongoose');
const { response } = require("express");
const { Categoria, Subcategoria } = require('../models/categoria');


// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(),
        Categoria.find()
            //.skip(Number(desde))
            //.limit(Number(limite))
            .populate("subcategorias", "nombre productos")
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    let query;

    if (mongoose.isValidObjectId(id)) { // El id puede ser un id de Mongo o el nombre de la categoria
        query = { "_id": id }
    } else {
        query = { "nombre": id }
    }

    const categoria = await Categoria.findOne(query)
        .populate("subcategorias");

    res.json({
        categoria
    });
}

const obtenerSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    let query;

    if (mongoose.isValidObjectId(id)) { // El id puede ser un id de Mongo o el nombre de la categoria
        query = { "_id": id }
    } else {
        query = { "nombre": id }
    }

    const subcategoria = await Subcategoria.findOne(query)
        .populate({
            path: 'productos',
            populate: { path: 'categoria subcategoria' },
        })

    res.json({
        subcategoria
    });
}

const crearCategoria = async (req, res = response) => {

    const { nombre, subcategorias } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    let newCategories = [];

    for (const sub of subcategorias) {
        const newsub = new Subcategoria({
            nombre: sub.nombre,
            productos: sub.productos
        });
        await newsub.save(); // Guardar Subcategoria en la base de datos
        newCategories.push(newsub);
    }

    const categoria = new Categoria({
        nombre: nombre,
        subcategorias: newCategories
    });

    // Guardar Categoria en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria nombre
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, subcategorias } = req.body;

    if (nombre) { // Si recibe el nombre se actualiza el nombre de la Categoria
        await Categoria.findByIdAndUpdate(id, { "nombre": nombre });
    }

    let categoria;

    const categoriaBuscar = await Categoria.findOne({ "_id": id })
        .populate("subcategorias", "nombre productos");

    for (const sub of subcategorias) {

        const existeSubCategoria = categoriaBuscar.subcategorias.find(element => element.nombre === sub.nombre);

        if (existeSubCategoria) { // Si existe la Subcategoria se actualiza

            categoria = await Subcategoria.findOneAndUpdate({ "nombre": sub.nombre },
                { $push: { "productos": sub.productos } },
                { new: true }
            );

        } else { // Si NO existe la Subcategoria se crea y se añade a la Categoria

            const newsub = new Subcategoria({
                nombre: sub.nombre,
                productos: sub.productos
            });

            await newsub.save(); // Guardar Subcategoria en la base de datos

            categoria = await Categoria.findByIdAndUpdate(id, { $push: { "subcategorias": newsub } }, { new: true }); // new Devuelve la respuesta actualizada

        }
    }

    res.json({
        categoria
    });
}

// borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    // Borrado fisico

    const categoria = await Categoria.findById(id);

    for (const sub of categoria.subcategorias) { //Borrar Subcategorias de la Categoria
        await Subcategoria.findByIdAndDelete(sub._id);
    }

    const categoriaBorrada = await Categoria.findByIdAndDelete(id); // Borrar la Categoria

    // Borrado lógico

    // const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        categoriaBorrada
    });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    obtenerSubCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}