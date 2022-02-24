const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeCategoriaPorId, existeSubCategoriaPorId } = require('../middlewares/validar-db');
const { checkAdmin } = require('../middlewares/validar-roles');

const {
    obtenerCategorias,
    obtenerCategoria,
    crearCategoria,
    actualizarCategoria,
    borrarCategoria,
    obtenerSubCategoria,
    actualizarSubCategoria,
    borrarSubCategoria,
    crearSubCategoria
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

// Obtener una categoria por id - publico
router.get('/subcategoria/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    //check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerSubCategoria);

// Crear categoria - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    checkAdmin,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearCategoria);

router.post('/subcategoria', [
    validarJWT,
    checkAdmin,
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    validarCampos
], crearSubCategoria);

// Actualizar - privado - cualquier persona con un token válido
router.put('/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

router.put('/subcategoria/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeSubCategoriaPorId),
    validarCampos
], actualizarSubCategoria);

// Borrar una categoria - Admin
router.delete('/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], borrarCategoria);

router.delete('/subcategoria/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es válido').isMongoId(),
    check('id').custom(existeSubCategoriaPorId),
    validarCampos
], borrarSubCategoria);

module.exports = router;