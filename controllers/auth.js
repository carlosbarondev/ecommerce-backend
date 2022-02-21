const { response, request } = require("express");
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require("../helpers/generar-jwt");
// const { googleVerify } = require("../helpers/google-verify");

const login = async (req = request, res = response) => {

    const { correo, password } = req.body;

    try {

        const usuario = await Usuario.findOne({ correo: correo });

        // Verificar si el email existe
        if (!usuario) {
            return res.status(400).json({
                msg: 'El correo no está registrado'
            });
        }

        // Verificar si el usuario no está activo
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'El usuario ha sido eliminado'
            });
        }

        // Verificar la contraseña
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            return res.status(400).json({
                msg: 'La contraseña no es correcta'
            });
        }

        // Generar JWT
        const token = await generarJWT(usuario.id, usuario.nombre, usuario.correo, usuario.rol, usuario.estado);

        res.json({
            usuario,
            token
        })

    } catch (error) {
        console.log(error);
        res.status(500).json({
            msg: 'Hable con el administrador'
        })
    }
}

const revalidarToken = async (req, res = response) => {

    const { uid, nombre, correo, rol, estado } = req;

    // Generar JWT
    const token = await generarJWT(uid, nombre, correo, rol, estado);

    res.json({
        ok: true,
        uid,
        nombre,
        correo,
        rol,
        estado,
        token
    });

}

/*
const googleSignIn = async (req, res = response) => {

    const { id_token } = req.body;

    try {

        const { correo, nombre, img } = await googleVerify(id_token);

        let usuario = await Usuario.findOne({ correo });

        if (!usuario) {
            //Tengo que crearlo
            const data = {
                nombre,
                correo,
                password: ':P',
                rol: "USER_ROLE",
                google: true
            };

            usuario = new Usuario(data);
            await usuario.save();
        }

        // Si el usuario en BD
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Hable con el administrador, usuario bloqueado'
            });
        }

        // Generar el JWT
        const token = await generarJWT(usuario.id);

        res.json({
            usuario,
            token
        });

    } catch (error) {
        res.status(400).json({
            msg: 'El Token de Google no es valido'
        })
    }

}
*/

module.exports = {
    login,
    revalidarToken,
    // googleSignIn
}