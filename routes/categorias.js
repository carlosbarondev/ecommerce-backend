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


router.get('/', obtenerCategorias);

router.get('/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    //check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

router.get('/subcategoria/:id', [
    //check('id', 'El id no es valido').isMongoId(),
    //check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerSubCategoria);

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