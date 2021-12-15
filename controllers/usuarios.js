const { request, response } = require('express');
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true }

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        usuarios
    });
}

const usuariosPost = async (req = request, res = response) => {

    const { nombre, correo, password } = req.body;
    const usuario = new Usuario({ nombre, correo, password });

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    // Guardar en la base de datos
    await usuario.save();

    res.status(201).json(usuario);
}

const usuariosPut = async (req = request, res = response) => {

    const { id } = req.params;
    const { nombre, correo, password } = req.body;

    //Validar el usuario a modificar respecto el usuario que viene en el JWT
    if (id !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios para editar este usuario'
        });
    }

    // Encriptar la contraseña
    const salt = bcryptjs.genSaltSync();
    const newPassword = bcryptjs.hashSync(password, salt);

    // Actualizar la base de datos
    const usuario = await Usuario.findByIdAndUpdate(id, { nombre, correo, password: newPassword }, { new: true });

    res.json(usuario);
}

/*const usuariosPatch = (req = request, res = response) => {
    res.json({
        msg: 'patch API - usuariosPatch',
    });
}*/

const usuariosDelete = async (req = request, res = response) => {

    const { id } = req.params;

    //Validar el usuario a eliminar respecto el usuario que viene en el JWT
    if (id !== req.uid) {
        return res.status(401).json({
            ok: false,
            msg: 'No tiene privilegios para eliminar este usuario'
        });
    }

    // Borrado fisico
    // const usuario = await Usuario.findByIdAndDelete(id);

    const usuario = await Usuario.findByIdAndUpdate(id, { estado: false }, { new: true });

    res.json({
        usuario
    });
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    // usuariosPatch,
    usuariosDelete,
}