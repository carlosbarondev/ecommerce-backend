const { response } = require("express");
const Categoria = require('../models/categoria');

// obtenerCategorias - paginado - total - populate
const obtenerCategorias = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
            .populate("usuario", "nombre")
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {

    const query = { _id: req.params.id, estado: true }

    const categoria = await Categoria.find(query).populate("usuario", "nombre");

    res.json({
        categoria
    });
}

const crearCategoria = async (req, res = response) => {

    const { nombre } = req.body;

    const categoriaDB = await Categoria.findOne({ nombre: nombre.toLowerCase() });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    const categoria = new Categoria({
        nombre: nombre.toLowerCase(),
        usuario: req.usuario._id
    });

    // Guardar en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria nombre
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre } = req.body;

    const categoria = await Categoria.findByIdAndUpdate(id, { nombre: nombre.toLowerCase(), usuario: req.usuario._id }, { new: true }); // new Devuelve la respuesta actualizada

    res.json(categoria);
}

// borrarCategoria - estado: false
const borrarCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const categoria = await Categoria.findByIdAndDelete(id);

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        categoriaBorrada
    });
}

module.exports = {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
}