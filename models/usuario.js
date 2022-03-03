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
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    telefono: {
        type: Number,
    },
    facturacion: direccion, // Dirección de facturación
    envio: [envio], // Dirección de los envios
    predeterminado: {
        type: Schema.Types.ObjectId,
    },
    deseos: [{ type: Schema.Types.ObjectId, ref: 'Producto' }],
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
    desactivar: {
        type: Boolean,
        default: true
    }
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