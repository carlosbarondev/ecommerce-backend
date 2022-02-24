const mongoose = require('mongoose');
const { response } = require("express");
const { Categoria, Subcategoria } = require('../models/categoria');


// obtenerCategorias - paginado - total - populate
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

// obtenerCategoria - populate {}
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

    if (mongoose.isValidObjectId(id)) { // El id puede ser un id de Mongo o el nombre de la categoria
        query = { "_id": id, "estado": true }
    } else {
        query = { "nombre": id, "estado": true }
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
/*
const crearSubCategoria = async (req, res = response) => {

    const { nombre, img, subcategorias } = req.body;

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
        try {
            await newsub.save(); // Guardar Subcategoria en la base de datos
        } catch (error) {
            return res.status(500).json(error);
        }
        newCategories.push(newsub);
    }

    const categoria = new Categoria({
        nombre: nombre,
        subcategorias: newCategories
    });

    // Guardar Categoria en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}*/

// actualizarCategoria nombre
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, subcategorias, estado } = req.body;

    // Si recibe el nombre se actualiza el nombre y estado de la Categoria
    const categoria = await Categoria.findByIdAndUpdate(id, { "nombre": nombre, "estado": estado }, { new: true })
        .populate("subcategorias");

    /*
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
    }*/

    res.json(
        categoria
    );
}

const actualizarSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, estado } = req.body;

    // Si recibe el nombre se actualiza el nombre y estado de la Categoria
    const subcategoria = await Subcategoria.findByIdAndUpdate(id, { "nombre": nombre, "estado": estado }, { new: true });

    /*
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
    }*/

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