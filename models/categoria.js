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
    ]
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
    ]
});

const Subcategoria = model('Subcategoria', SubcategoriaSchema);
const Categoria = model('Categoria', CategoriaSchema);

module.exports = {
    Subcategoria,
    Categoria
}