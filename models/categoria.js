const { Schema, model } = require('mongoose');

const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    subcategorias: [
        {
            nombre: {
                type: String,
                required: [true, 'El nombre es obligatorio'],
                unique: true
            },
            productos: [
                {
                    type: Schema.Types.ObjectId,
                    ref: 'Producto'
                }
            ]
        }
    ]
});

module.exports = model('Categoria', CategoriaSchema);