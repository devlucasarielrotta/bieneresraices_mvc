import Precio from "../models/Precio.js"
import Categoria from "../models/Categoria.js"

const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra:true
    })
}

// crear una nueva propiedades
const crear = async (req,res) => {
    // Consultar modelo precio y categoria
    const [precios,categorias] = await Promise.all([
        Precio.findAll(), 
        Categoria.findAll() 
    ])

    res.render('propiedades/crear',{
        pagina: 'Crear propiedades',
        barra:true,
        categorias,
        precios
    })
}

export {
    admin,
    crear
}