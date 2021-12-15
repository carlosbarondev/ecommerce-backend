const { response } = require("express");
const Producto = require("../models/producto");

// obtenerProductos - paginado - total - populate
const obtenerProductos = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, productos] = await Promise.all([
        Producto.countDocuments(query),
        Producto.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
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

    const { estado, usuario, ...body } = req.body;

    const productoDB = await Producto.findOne({ nombre: body.nombre });

    if (productoDB) {
        return res.status(400).json({
            msg: `El producto ${productoDB.nombre}, ya existe`
        });
    }

    // Generar la data a guardar, excluyo que desde el front end me manden el estado por ejemplo
    const data = {
        ...body,
        nombre: body.nombre.toUpperCase(),
        usuario: req.usuario._id, // Viene por referencia del JWT
    }

    const producto = new Producto(data);

    // Guardar DB
    await producto.save();

    res.status(201).json(producto);

}

// actualizarProducto nombre
const actualizarProducto = async (req = request, res = response) => {

    const { id } = req.params;
    const { estado, usuario, ...data } = req.body;

    if (data.nombre) {
        data.nombre = data.nombre.toUpperCase();
    }

    data.usuario = req.usuario._id;

    const producto = await Producto.findByIdAndUpdate(id, data, { new: true }); // new devuelve la respuesta actualizada

    res.json(producto);
}

// borrarProducto - estado: false
const borrarProducto = async (req = request, res = response) => {

    const { id } = req.params;

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const productoBorrado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true });
    const usuarioAutenticado = req.usuario; // Viene de validar-jwt.js por referencia

    res.json({
        productoBorrado,
        usuarioAutenticado
    });
}

module.exports = {
    obtenerProductos,
    obtenerProducto,
    crearProducto,
    actualizarProducto,
    borrarProducto
}