const { Router } = require('express');
const { check } = require('express-validator');

const { mostrarPago, crearPago, mostrarUsuario } = require('../controllers/pagos');
const { validarCampos } = require('../middlewares/validar-campos');
const { existeUsuarioPorId } = require('../middlewares/validar-db');
const { validarJWT } = require('../middlewares/validar-jwt');


const router = Router();

router.get("/usuario/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], mostrarUsuario);

router.get("/:payment_intent", [
    validarJWT,
], mostrarPago);

router.post("/:id", [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], crearPago);


module.exports = router;