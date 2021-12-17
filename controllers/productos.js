const { response } = require("express");
const Producto = require("../models/producto");
const Categoria = require("../models/categoria");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {

    // const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            // .skip(Number(desde))
            // .limit(Number(limite))
            .populate("usuario", "nombre")
            .populate("categoria", "nombre")
    ]);

    res.json({
        total,
        productos
    });
}

// obtenerProducto - populate {}
const obtenerProducto = async (req = request, res = response) => {

    const query = { _id: req.params.id, estado: true }

    const producto = await Producto.find(query).populate("usuario", "nombre").populate("categoria", "nombre");

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

    const { nombre, descripcion, precio, stock, img, categoria } = req.body;

    const productoDB = await Producto.findOne({ nombre: nombre.toLowerCase() });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    const { _id } = await Categoria.findOne({ nombre: categoria.toLowerCase() });

    const producto = new Producto({ nombre: nombre.toLowerCase(), descripcion, precio, stock, img, categoria: _id, usuario: req.usuario._id });

    // Guardar en la base de datos
    await producto.save();

    res.status(201).json(producto);

}

// actualizarProducto nombre
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, descripcion, precio, stock, img, categoria } = req.body;

    const producto = await Producto.findByIdAndUpdate(id, { nombre: nombre.toLowerCase(), descripcion, precio, stock, img, categoria, usuario: req.usuario._id }, { new: true }); // new devuelve la respuesta actualizada

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

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}