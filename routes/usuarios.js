const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const { emailExiste, existeUsuarioPorId } = require('../middlewares/validar-db');
const { checkAdmin } = require('../middlewares/validar-roles');

const {
    usuariosGet,
    usuariosGetId,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    // usuariosPatch,
    usuariosEnvioGet,
    usuariosEnvioPost,
    usuariosEnvioPut,
    usuariosEnvioDelete,
    usuariosFacturacionGet,
    usuariosFacturacionPost,
    usuariosFacturacionDelete,
    usuariosDeseosGet,
    usuariosDeseosPost,
    usuariosDeseosDelete,
} = require('../controllers/usuarios');

const router = Router();


router.get('/', usuariosGet);

router.get('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosGetId);

router.post('/', [
    check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    check('correo', 'El correo no es válido').isEmail(),
    check('correo').custom(emailExiste),
    validarCampos
], usuariosPost);

router.put('/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    //check('nombre', 'El nombre es obligatorio').not().isEmpty(),
    //check('password', 'La contraseña debe tener al menos 6 caracteres').isLength({ min: 6 }),
    //check('correo', 'El correo no es válido').isEmail(),
    validarCampos
], usuariosPut);

router.delete('/:id', [
    validarJWT,
    checkAdmin,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDelete);

// router.patch('/', usuariosPatch);

router.get('/envio/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosEnvioGet);

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

router.put('/envio/:id', [
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
], usuariosEnvioPut);

router.delete('/envio/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosEnvioDelete);

router.get('/facturacion/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosFacturacionGet);

router.post('/facturacion/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    check('poblacion', 'La poblacion es obligatoria').not().isEmpty(),
    check('poblacion', 'La poblacion debe ser un string').isString(),
    check('pais', 'El pais es obligatorio').not().isEmpty(),
    check('pais', 'El pais debe ser un string').isString(),
    check('pais', 'El pais debe tener dos letras').isLength(2),
    check('calle', 'La calle es obligatoria').not().isEmpty(),
    check('calle', 'La calle debe ser un string').isString(),
    check('numero', 'El numero es obligatorio').not().isEmpty(),
    check('numero', 'El numero debe ser un string').isString(),
    check('codigo', 'El codigo es obligatorio').not().isEmpty(),
    check('codigo', 'El codigo debe ser un numero').isNumeric(),
    check('codigo', 'El codigo debe tener cinco numeros').isLength(5),
    check('provincia', 'La provincia es obligatoria').not().isEmpty(),
    check('provincia', 'La provincia debe ser un string').isString(),
    validarCampos
], usuariosFacturacionPost);

router.delete('/facturacion/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosFacturacionDelete);

router.get('/deseos/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDeseosGet);

router.post('/deseos/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDeseosPost);

router.delete('/deseos/:id', [
    validarJWT,
    check('id', 'El id no es valido').isMongoId(),
    check('id').custom(existeUsuarioPorId),
    validarCampos
], usuariosDeseosDelete);


module.exports = router;