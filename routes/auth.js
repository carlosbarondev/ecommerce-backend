const { Router } = require('express');
const { check } = require('express-validator');

const { login, /*googleSignIn*/ } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

router.post('/', [
    check('correo', 'El correo es obligatorio').not().isEmpty(),
    check('correo', 'El correo no es valido').isEmail(),
    check('password', 'La contraseña es obligatoria').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    validarCampos
], login);

module.exports = router;