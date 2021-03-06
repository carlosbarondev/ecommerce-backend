const { Schema, model } = require('mongoose');


const SubcategoriaSchema = Schema({
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
    ],
    img: {
        type: String
    },
    estado: {
        type: Boolean,
        default: true
    },
    desactivar: {
        type: Boolean,
        default: true
    }
});


const CategoriaSchema = Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        unique: true
    },
    subcategorias: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Subcategoria'
        }
    ],
    img: {
        type: String
    },
    vendidos: {
        type: Number,
        default: 0
    },
    estado: {
        type: Boolean,
        default: true
    },
    desactivar: {
        type: Boolean,
        default: true
    }
});


const Subcategoria = model('Subcategoria', SubcategoriaSchema);
const Categoria = model('Categoria', CategoriaSchema);


module.exports = {
    Subcategoria,
    Categoria
}