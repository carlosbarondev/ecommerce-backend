const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { emailExiste, existeUsuarioPorId } = require('../middlewares/validar-db');

const {
    usuariosGet,
    usuariosDireccionGet,
    usuariosPost,
    usuariosDireccionPost,
    usuariosPut,
    // usuariosPatch,
    usuariosDelete
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.get('/direccion/:id', usuariosDireccionGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost);

router.post('/direccion/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('direccion', 'La direccion es obligatoria').not().isEmpty(),
    check('poblacion', 'La poblacion es obligatoria').not().isEmpty(),
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('telefono', 'El telefono no es válido').isNumeric(),
    check('codigo', 'El codigo no es válido').isNumeric(),
    validarCampos
], usuariosDireccionPost);

router.put('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

// router.patch('/', usuariosPatch);

module.exports = router;