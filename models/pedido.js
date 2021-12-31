const { Schema, model } = require('mongoose');

const PedidoSchema = Schema({
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    producto: [{
        type: Schema.Types.ObjectId,
        ref: 'Producto',
        required: [true, 'El producto es obligatorio']
    }],
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },
    direccion: {
        type: String,
        required: [true, 'La direccion es obligatoria'],
    },
    pago: {
        type: String,
        required: [true, 'El metodo de pago es obligatorio'],
    },
    estado: {
        type: Boolean,
        required: true,
        default: true
    }
});

/*PedidoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}*/

module.exports = model('Pedido', PedidoSchema);