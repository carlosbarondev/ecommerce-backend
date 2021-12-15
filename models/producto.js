const { Schema, model } = require('mongoose');

const ProductoSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    descripcion: {
        type: String,
        required: [true, 'La descripcion es obligatoria'],
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        default: 0
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        default: 0
    },
    img: {
        type: String
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
});

/*ProductoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}*/

module.exports = model('Producto', ProductoSchema);