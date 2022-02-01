const mongoose = require('mongoose');
const { response } = require("express");

const { Categoria, Subcategoria } = require('../models/categoria');
const Producto = require("../models/producto");
const Pedido = require("../models/pedido");


// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;

    const [total, productos] = await Promise.all([
        Producto.countDocuments(),
        Producto.find()
            // .skip(Number(desde))
            // .limit(Number(limite))
            .populate("categoria subcategoria")
    ]);

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) => {

    const { id } = req.params;

    let query;

    if (mongoose.isValidObjectId(id)) { // El id puede ser un id de Mongo o el nombre del producto
        query = { "_id": id }
    } else {
        query = { "nombre": id.replace(/-/g, ' ') }
    }

    const producto = await Producto.findOne(query)
        .populate("categoria subcategoria opinion.usuario");


    if (producto.length === 0) {
        return res.status(400).json({
            msg: `El producto no existe`
        });
    }

    res.json({
        producto
    });
}

const crearProducto = async (req, res = response) => {

    const { nombre, descripcion, precio, stock, img, categoria, subcategoria } = req.body;

    const productoDB = await Producto.findOne({ nombre: nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const categoriaBuscar = await Categoria.findOne({ "nombre": categoria })
        .populate("subcategorias")
        .exec(async function (err, cat) {
            if (err) console.log(err);
            const existeSubCategoria = await cat.subcategorias.find(element => element.nombre === subcategoria);
            if (!existeSubCategoria) {
                return res.status(400).json({
                    msg: `La subcategoría ${subcategoria}, no existe`
                });
            }

            const producto = new Producto({ nombre: nombre, descripcion, precio, stock, img, categoria: cat._id, subcategoria: existeSubCategoria._id });

            const agrega = await Subcategoria.findByIdAndUpdate(existeSubCategoria._id, { $push: { "productos": producto._id } }, // Agrega el id del producto en la subcategoria
                {
                    new: true
                });

            // Guardar en la base de datos
            await producto.save();

            res.status(201).json(producto);
        });

}

// actualizarProducto nombre
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, descripcion, precio, stock, img, categoria } = req.body;

    const producto = await Producto.findByIdAndUpdate(id, { nombre: nombre, descripcion, precio, stock, img, categoria, usuario: req.usuario._id }, { new: true }); // new devuelve la respuesta actualizada

    res.json(producto);
}

// borrarProducto - estado: false
const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const producto = await Producto.findByIdAndDelete(id);

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        productoBorrado
    });
}

const obtenerComentarioProducto = async (req = request, res = response) => {

    const { id } = req.params;

    //Validar el usuario a consultar respecto el usuario que viene en el JWT
    if (id !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios para ver este usuario'
        });
    }

    const valorados = await Producto.find({ "opinion.usuario": id }, { "nombre": 1, "img": 1, "opinion.$": 1 });

    const productosSinOpinionUsuario = await Producto.find({ "opinion.usuario": { $nin: id } });

    const noValorados = [];

    for (const producto of productosSinOpinionUsuario) {
        const pedidos = await Pedido.find({ "usuario": id, "producto.producto.nombre": producto.nombre });
        if (pedidos.length > 0) {
            noValorados.push(producto)
        }
    }

    res.json({
        valorados,
        noValorados
    });
}

const crearComentarioProducto = async (req, res = response) => {

    const { id } = req.params;
    const { titulo, comentario, rating, usuario, fecha } = req.body;

    let producto;

    const existeComentario = await Producto.findOne({ _id: id, "opinion.usuario": usuario });

    if (existeComentario) { // Si el usuario ya tiene un comentario en el producto lo actualiza
        producto = await Producto.findOneAndUpdate({ _id: id, "opinion.usuario": usuario }, { '$set': { "opinion.$.titulo": titulo, "opinion.$.comentario": comentario, "opinion.$.rating": rating, "opinion.$.usuario": usuario, "opinion.$.fecha": fecha } }, { new: true }); // new devuelve la respuesta actualizada
    } else { // Si el usuario no tiene un comentario en el producto lo añade
        producto = await Producto.findByIdAndUpdate(id, { $push: { "opinion": { titulo, comentario, rating, usuario, fecha } } }, { new: true }); // new devuelve la respuesta actualizada
    }

    res.json(producto);

}

// borrarProducto - estado: false
const borrarComentarioProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { idProducto, idComentario } = req.body;

    //Validar el usuario a eliminar respecto el usuario que viene en el JWT
    if (id !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios para eliminar el comentario del usuario'
        });
    }

    // Borrado fisico
    const comentarioBorrado = await Producto.findOneAndUpdate({ "_id": idProducto }, { $pull: { opinion: { _id: idComentario } } }, { new: true });

    res.json({
        comentarioBorrado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto,
    obtenerComentarioProducto,
    crearComentarioProducto,
    borrarComentarioProducto
}