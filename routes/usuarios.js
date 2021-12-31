const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { emailExiste, existeUsuarioPorId } = require('../middlewares/validar-db');

const {
    usuariosGet,
    usuariosEnvioGet,
    usuariosPost,
    usuariosDireccionPost,
    usuariosEnvioPost,
    usuariosPut,
    // usuariosPatch,
    usuariosDelete,
} = require('../controllers/usuarios');

const router = Router();

router.get('/', usuariosGet);

router.get('/envio/:id', usuariosEnvioGet);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost);

router.post('/direccion', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('direccion.poblacion', 'La poblacion es obligatoria').not().isEmpty(),
    check('direccion.poblacion', 'La poblacion debe ser un string').isString(),
    check('direccion.pais', 'El pais es obligatorio').not().isEmpty(),
    check('direccion.pais', 'El pais debe ser un string').isString(),
    check('direccion.pais', 'El pais debe tener dos letras').isLength(2),
    check('direccion.calle', 'La calle es obligatoria').not().isEmpty(),
    check('direccion.calle', 'La calle debe ser un string').isString(),
    check('direccion.numero', 'El numero es obligatorio').not().isEmpty(),
    check('direccion.numero', 'El numero debe ser un string').isString(),
    check('direccion.codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('direccion.codigo', 'El codigo debe ser un numero').isNumeric(),
    check('direccion.codigo', 'El codigo debe tener cinco numeros').isLength(5),
    check('direccion.provincia', 'La provincia es obligatoria').not().isEmpty(),
    check('direccion.provincia', 'La provincia debe ser un string').isString(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('telefono', 'El teléfono debe ser un número').isNumeric(),
    check('telefono', 'El teléfono debe tener nueve numeros').isLength(9),
    validarCampos
], usuariosDireccionPost);

router.post('/envio/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('direccion.poblacion', 'La poblacion es obligatoria').not().isEmpty(),
    check('direccion.poblacion', 'La poblacion debe ser un string').isString(),
    check('direccion.pais', 'El pais es obligatorio').not().isEmpty(),
    check('direccion.pais', 'El pais debe ser un string').isString(),
    check('direccion.pais', 'El pais debe tener dos letras').isLength(2),
    check('direccion.calle', 'La calle es obligatoria').not().isEmpty(),
    check('direccion.calle', 'La calle debe ser un string').isString(),
    check('direccion.numero', 'El numero es obligatorio').not().isEmpty(),
    check('direccion.numero', 'El numero debe ser un string').isString(),
    check('direccion.codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('direccion.codigo', 'El codigo debe ser un numero').isNumeric(),
    check('direccion.codigo', 'El codigo debe tener cinco numeros').isLength(5),
    check('direccion.provincia', 'La provincia es obligatoria').not().isEmpty(),
    check('direccion.provincia', 'La provincia debe ser un string').isString(),
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('nombre', 'El nombre debe ser un string').isString(),
    check('telefono', 'El telefono es obligatorio').not().isEmpty(),
    check('telefono', 'El teléfono debe ser un número').isNumeric(),
    check('telefono', 'El teléfono debe tener nueve numeros').isLength(9),
    validarCampos
], usuariosEnvioPost);

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