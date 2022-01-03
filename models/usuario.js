const { Schema, model } = require('mongoose');


const direccion = Schema({
    poblacion: {
        type: String,
        required: [true, 'La poblacion es obligatoria']
    },
    pais: {
        type: String,
        required: [true, 'El pais es obligatorio']
    },
    calle: {
        type: String,
        required: [true, 'La direccion1 es obligatoria']
    },
    numero: {
        type: String,
        required: [true, 'La direccion2 es obligatoria']
    },
    codigo: {
        type: Number,
        required: [true, 'El codigo postal es obligatorio']
    },
    provincia: {
        type: String,
        required: [true, 'La provincia es obligatoria']
    },
});

const envio = Schema({
    direccion: direccion,
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    telefono: {
        type: Number,
        required: [true, 'El telefono es obligatorio']
    },
});

const UsuarioSchema = Schema({
    facturacion: direccion, // Dirección de facturación
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    telefono: {
        type: Number,
    },
    envio: [envio], // Dirección de los envios
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        enum: ['ADMIN_ROLE', 'USER_ROLE'],
        default: 'USER_ROLE'
    },
    estado: {
        type: Boolean,
        default: true
    },
    /*google: {
        type: Boolean,
        default: false
    },*/
});

/*UsuarioSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}*/

module.exports = model('Usuario', UsuarioSchema);