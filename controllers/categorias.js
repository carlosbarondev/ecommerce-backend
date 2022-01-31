const { response } = require("express");
const { subcategoriaExiste } = require("../middlewares/validar-db");
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
            .populate("subcategorias.productos", "nombre")
    ]);

    res.json({
        total,
        categorias
    });
}

// obtenerCategoria - populate {}
const obtenerCategoria = async (req = request, res = response) => {

    const query = { nombre: req.params.id }

    const categoria = await Categoria.findOne(query);

    res.json({
        categoria
    });
}

const obtenerSubCategoria = async (req = request, res = response) => {

    const { id } = req.params;

    const { nombre, subcategorias } = await Categoria.findOne({ "subcategorias": { $elemMatch: { "nombre": id } } }, { "nombre": 1, "subcategorias": { $elemMatch: { "nombre": id } } })
        .populate("subcategorias.productos", "nombre descripcion precio img categoria subcategoria");

    res.json({
        nombre,
        subcategoria: subcategorias[0]
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

    const categoria = new Categoria({
        nombre: nombre,
        subcategorias
    });

    // Guardar en la base de datos
    await categoria.save();

    res.status(201).json(categoria);

}

// actualizarCategoria nombre
const actualizarCategoria = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, subcategorias } = req.body;

    let categoria;

    categoria = await Categoria.findByIdAndUpdate(id, { nombre: nombre }, { new: true });

    if (subcategorias) {

        for (const sub of subcategorias) {

            const existeSubCategoria = await Categoria.findOne({ "_id": id, "subcategorias": { $elemMatch: { "nombre": sub.nombre } } });

            if (existeSubCategoria) {

                categoria = await Categoria.findOneAndUpdate({ "_id": id },
                    { $set: { "subcategorias.$[index].productos": sub.productos } },
                    {
                        arrayFilters: [{ "index.nombre": sub.nombre }],
                        new: true
                    });

            } else {
                categoria = await Categoria.findByIdAndUpdate(id, { $push: { "subcategorias": sub } }, { new: true }); // new Devuelve la respuesta actualizada
            }
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
    // const categoria = await Categoria.findByIdAndDelete(id);

    const categoriaBorrada = await Categoria.findByIdAndUpdate(id, { estado: false }, { new: true });

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