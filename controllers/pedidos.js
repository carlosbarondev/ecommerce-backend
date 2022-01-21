const { response } = require("express");
const Pedido = require("../models/pedido");

// obtenerProductos - paginado - total - populate
/*const obtenerProductos = async (req = request, res = response) => {

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
}*/

// obtenerPedidosUsuario - paginado - total - populate
const obtenerPedidosUsuario = async (req = request, res = response) => {

    const { id } = req.params;

    //Validar el usuario a eliminar respecto el usuario que viene en el JWT
    if (id !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios para ver este usuario'
        });
    }

    // const { limite = 5, desde = 0 } = req.query;
    const query = { usuario: id }

    const [total, pedidos] = await Promise.all([
        Pedido.countDocuments(query),
        Pedido.find(query)
        // .skip(Number(desde))
        // .limit(Number(limite))
    ]);

    res.json({
        total,
        pedidos
    });
}

// obtenerProducto - populate {}
/*const obtenerProducto = async (req = request, res = response) => {

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
*/
const crearPedido = async (req, res = response) => {

    const { idPedido, usuario, producto, fecha, direccionEnvio, direccionFacturacion, metodoPago, digitos, total } = req.body;

    const pedido = new Pedido({ idPedido, usuario, producto, fecha, direccionEnvio, direccionFacturacion, metodoPago, digitos, total });

    // Guardar en la base de datos
    await pedido.save();

    res.status(201).json(pedido);

}
/*
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
*/
module.exports = {
    //obtenerProductos,
    //obtenerProducto,
    obtenerPedidosUsuario,
    crearPedido,
    //actualizarProducto,
    //borrarProducto
}