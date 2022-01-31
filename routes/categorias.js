const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeCategoriaPorId } = require('../middlewares/validar-db');

const {
    obtenerCategorias,
    obtenerCategoria,
    obtenerSubCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria
} = require('../controllers/categorias');

const router = Router();

// Obtener todas las categorias - publico
router.get('/', obtenerCategorias);

// Obtener una categoria por id - publico
router.get('/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    //check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

router.get('/subcategoria/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    validarCampos
], obtenerSubCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('subcategorias.*.productos', 'El id del producto no es válido').isMongoId(),
    //check('subcategorias.*.productos').custom(existeProductoPorId),
    validarCampos
], crearCategoria);

// Actualizar - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    //check('subcategorias.*.productos', 'El id del producto no es válido').isMongoId(),
    //check('subcategorias.*.productos').custom(existeProductoPorId),
    validarCampos
], actualizarCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

module.exports = router;