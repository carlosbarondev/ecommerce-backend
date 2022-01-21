const { Router } = require('express');
const { check, body } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeProductoPorId, productoExiste, existeUsuarioPorId, existeFacturacionPorId } = require('../middlewares/validar-db');

const {
    //obtenerProductos,
    //obtenerProducto,
    crearPedido, obtenerPedidosUsuario,
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

// Obtener un pedido por id - privado
router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], obtenerPedidosUsuario);

// Crear pedido - privado - cualquier persona con un token válido
router.post('/', [
    validarJWT,
    body('usuario', 'El usuario no es valido').isMongoId(),
    body('usuario').custom(existeUsuarioPorId),
    //body('producto', 'El producto no es valido').isMongoId(),
    //body('producto').custom(existeProductoPorId),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    //check('direccionEnvio', 'El id de la dirección de envío no es correcto').isMongoId(),
    //check('direccionEnvio', 'La direccion de envío es obligatoria').not().isEmpty(),
    //check('direccionFacturacion', 'La direccion de facturación es obligatoria').not().isEmpty(),
    //check('direccionFacturacion', 'El id de la dirección de facturaciónno es correcto').isMongoId(),
    //check('direccionFacturacion').custom(existeFacturacionPorId),
    check('metodoPago', 'El metodo de pago es obligatorio').not().isEmpty(),
    check('digitos', 'Ultimos digitos son obligatorios').not().isEmpty(),
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