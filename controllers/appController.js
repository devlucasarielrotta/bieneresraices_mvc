import { Sequelize } from "sequelize"
import { Precio,Categoria,Propiedad } from "../models/index.js"




const inicio = async (req, res) => {


    const [categorias,precios, casas,departamentos] = await Promise.all([
        Categoria.findAll({
            raw: true
        }),
        Precio.findAll({
            raw:true
        }),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:1
            },
            include:[
                {model: Precio , as: 'precio'}
            ],
            order:[['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:2
            },
            include:[
                {model: Precio , as: 'precio'}
            ],
            order:[['createdAt', 'DESC']]
        }),
        Propiedad.findAll({
            limit:3,
            where:{
                categoriaId:3
            },
            include:[
                {model: Precio , as: 'precio'}
            ],
            order:[['createdAt', 'DESC']]
        })

    ])


    res.render('inicio', {
        pagina: 'Inicio',
        categorias,
        precios,
        csrfToken: req.csrfToken()
    })
}

const categorias = async(req, res) => {
    const {id} = req.departamentos

    const categoria = await Categorida.findByPk(id)

    if(!categoria){
        return res.redirect('/404')
    }

    const propiedades = await Propiedad.findAll({
        where: {
            categoridaId: id
        },
        include: [
            {model: Precio , as : 'precio'}
        ]
    })

    res.render('categoria',{
        pagina:`${categoria.nombre}s en Venta`,
        propiedades,
        csrfToken: req.csrfToken()
    })
}

const noEncontrado = (req, res) => {
    res.status(404).render('404', {
        pagina: 'Página no encontrada',
        csrfToken: req.csrfToken()
    })
}

const buscador = async(req, res) => {   
    const {termino} = req.body

    if(!termino.trim()){
        return res.redirect('back')
    } 

    const propiedades = await Propiedad.findAll({
        where:{
            titulo:{
                [Sequelize.Op.like]: '%'+ termino + '%'
            }
        },
        include: {
            model:Precio, as:'precio'
        }
    })

    res.render('busqueda',{
        pagina:'Resultados de la Búsqueda',
        propiedades,
        csrfToken: req.csrfToken()
    })
}
export {
    buscador,
    inicio,
    categorias,
    noEncontrado
}