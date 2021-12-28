const { Schema, model } = require('mongoose');


const direccion = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    telefono: {
        type: Number,
        required: [true, 'El telefono es obligatorio']
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria']
    },
    poblacion: {
        type: String,
        required: [true, 'La poblacion es obligatoria']
    },
    codigo: {
        type: Number,
        required: [true, 'El codigo postal es obligatorio']
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
    direccion: [direccion],
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