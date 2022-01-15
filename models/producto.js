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
    rating: {
        type: Number
    },
    opinion: [
        {
            titulo: {
                type: String,
                required: [true, 'El título es obligatorio'],
            },
            comentario: {
                type: String,
                required: [true, 'El comentario es obligatorio'],
            },
            rating: {
                type: Number,
                required: [true, 'El rating es obligatorio'],
            },
            usuario: {
                type: Schema.Types.ObjectId,
                ref: 'Usuario',
                required: [true, 'El usuario es obligatorio']
            },
            fecha: {
                type: Date,
                required: [true, 'La fecha es obligatoria'],
            },
        }
    ],
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

ProductoSchema.post('findOneAndUpdate', async function (doc) { // Actualiza el rating al insertar opiniones de los usuarios

    let r = 0;

    doc.opinion.map(op => (
        r += op.rating
    ));

    r = r / doc.opinion.length;

    doc.rating = r;
    doc.save();

});

module.exports = model('Producto', ProductoSchema);