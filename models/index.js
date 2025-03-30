import Propiedad from './Propiedad.js'
import Precio from './Precio.js'
import Categoria from './Categoria.js'
import Usuario from './Usuario.js'

Precio.hasOne(Propiedad, {foreignKey:'precioId' }); // Propiedad.belongsTo(Precio)
Categoria.hasOne(Propiedad, {foreignKey:'categoriaId'}); 
Propiedad.belongsTo(Usuario,{foreignKey:'usuarioId'})



export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}