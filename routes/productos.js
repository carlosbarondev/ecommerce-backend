const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeProductoPorId, existeUsuarioPorId, existeCategoriaPorId, existeSubCategoriaPorId } = require('../middlewares/validar-db');
const { checkAdmin } = require('../middlewares/validar-roles');

const {
    obtenerProductos,
    obtenerProducto,
    obtenerMejoresProductosCategoria,
    crearProducto,
    actualizarProducto,
    borrarProducto,
    crearComentarioProducto,
    obtenerComentarioProducto,
    borrarComentarioProducto
} = require('../controllers/productos');

const router = Router();


router.get('/', obtenerProductos);

router.get('/producto/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    //check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);

router.get('/mejor', obtenerMejoresProductosCategoria);

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('descripcion', 'La descripcion es obligatoria').not().isEmpty(),
    check('precio', 'El precio es obligatorio').not().isEmpty(),
    check('stock', 'El stock es obligatorio').not().isEmpty(),
    check('categoria').custom(existeCategoriaPorId),
    check('subcategoria').custom(existeSubCategoriaPorId),
    validarCampos
], crearProducto);

router.put('/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

router.delete('/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);

router.get('/valoraciones/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], obtenerComentarioProducto);

router.post('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    check('titulo', 'El titulo es obligatorio').not().isEmpty(),
    check('comentario', 'El comentario es obligatorio').not().isEmpty(),
    check('rating', 'El rating es obligatorio').not().isEmpty(),
    check('usuario', 'El usuario es obligatorio').not().isEmpty(),
    check('usuario').custom(existeUsuarioPorId),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    validarCampos
], crearComentarioProducto);

router.delete('/valoraciones/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], borrarComentarioProducto);


module.exports = router;