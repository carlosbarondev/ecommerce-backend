const { Schema, model } = require('mongoose');

const PedidoSchema = Schema({
    idPedido: {
        type: String,
        required: [true, 'El id de pedido es obligatorio'],
        unique: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: [true, 'El usuario es obligatorio']
    },
    producto: [],
    fecha: {
        type: Date,
        required: [true, 'La fecha es obligatoria'],
    },
    direccionEnvio: {},
    direccionFacturacion: {},
    metodoPago: {
        type: String,
        required: [true, 'El metodo de pago es obligatorio'],
    },
    digitos: {
        type: String,
        required: [true, 'Ultimos digitos son obligatorios'],
    },
    total: {
        type: Number,
        required: [true, 'El importe total es obligatorio'],
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