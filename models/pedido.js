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
    producto: [
        {
            unidades: {
                type: Number,
                required: [true, 'El número de unidades es obligatorio'],
            },
            producto: {
                type: Schema.Types.ObjectId,
                ref: 'Producto',
                required: [true, 'El producto es obligatorio']
            }
        }
    ],
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
    }
});


/*PedidoSchema.methods.toJSON = function () {
    const { __v, estado, ...data } = this.toObject();
    return data;
}*/


module.exports = model('Pedido', PedidoSchema);