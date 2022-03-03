const { Router } = require('express');
const { check, body } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { existeUsuarioPorId } = require('../middlewares/validar-db');

const {
    crearPedido, obtenerPedidosUsuario,
} = require('../controllers/pedidos');

const router = Router();


router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], obtenerPedidosUsuario);

router.post('/', [
    validarJWT,
    body('usuario', 'El usuario no es valido').isMongoId(),
    body('usuario').custom(existeUsuarioPorId),
    check('fecha', 'La fecha es obligatoria').not().isEmpty(),
    check('metodoPago', 'El metodo de pago es obligatorio').not().isEmpty(),
    check('digitos', 'Ultimos digitos son obligatorios').not().isEmpty(),
    validarCampos
], crearPedido);


module.exports = router;