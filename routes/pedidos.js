const { Router } = require('express');
const { check, body } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeProductoPorId, productoExiste, existeUsuarioPorId } = require('../middlewares/validar-db');

const {
    //obtenerProductos,
    //obtenerProducto,
    crearPedido,
    //actualizarProducto,
    //borrarProducto
} = require('../controllers/pedidos');

const router = Router();

// Obtener todos los pedidos - privado
//router.get('/', obtenerProductos);

// Obtener un pedido por id - privado
/*router.get('/:id', [
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], obtenerProducto);*/

// Crear pedido - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    body('usuario', 'El usuario no es valido').isMongoId(),
    body('usuario').custom(existeUsuarioPorId),
    body('producto', 'El producto no es valido').isMongoId(),
    body('producto').custom(existeProductoPorId),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('pago', 'El metodo de pago es obligatorio').not().isEmpty(),
    validarCampos
], crearPedido);

// Actualizar - privado - cualquier persona con un token válido
/*router.put('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], actualizarProducto);

// Borrar un producto - Admin
router.delete('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeProductoPorId),
    validarCampos
], borrarProducto);*/

module.exports = router;