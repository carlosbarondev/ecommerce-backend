const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { coleccionesPermitidas } = require('../middlewares/validar-db');
const { validarArchivoSubir } = require('../middlewares/validar-archivo');
const { validarJWT } = require('../middlewares/validar-jwt');

const { mostrarImagen, actualizarImagenCloudinary } = require('../controllers/uploads');


const router = Router();

router.get('/:coleccion/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias', 'subcategorias'])),
    validarCampos
], mostrarImagen);

router.put('/:coleccion/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('coleccion').custom(c => coleccionesPermitidas(c, ['usuarios', 'productos', 'categorias', 'subcategorias'])),
    validarArchivoSubir,
    validarCampos
], actualizarImagenCloudinary);

module.exports = router;