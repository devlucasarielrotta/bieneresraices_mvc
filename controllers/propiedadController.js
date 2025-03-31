import { validationResult } from "express-validator"
import {Precio,Categoria,Propiedad} from '../models/index.js'


const admin = async (req, res) => {
    const {id} = req.usuario;
 
    const propiedades = await Propiedad.findAll({
        where: {
            usuarioId: id
        },
        include: [
            {model:Categoria, as:'categoria'},
            {model: Precio}
        ]
    })

    res.render('propiedades/admin', {
        pagina: 'Mis propiedades',
        propiedades,
    })
}

// crear una nueva propiedades
const crear = async (req, res) => {
    // Consultar modelo precio y categoria
    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
    ])

    res.render('propiedades/crear', {
        pagina: 'Crear propiedades',
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: {}
    })
}

const guardar = async (req, res) => {
    // validación;
    let resultado = validationResult(req);
    
    if (!resultado.isEmpty()) {
        // Consultar modelo precio y categoria
        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ])
        return res.render('propiedades/crear', {
            pagina: 'Crear Propiedad',
            categorias,
            precios,
            errores: resultado.array(),
            csrfToken: req.csrfToken(),
            datos:req.body
        })
    
    }
    try{ 
        const propiedadGuardada = await Propiedad.create({
            ...req.body,
            precioId: req.body.precio,
            categoriaId: req.body.categoria,
            usuarioId: req.usuario.id,
            imagen: ''
        })

        const {id} = propiedadGuardada;
        res.redirect(`/api/v1/propiedades/agregar-imagen/${id}`)
    }catch(error){

    }
    
}

const agregarImagen = async(req,res) => {
    const {id} = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }   
    //validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }
    // validar que la propiedad pertenece a quien visita esta pagina
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/api/v1/propiedades/mis-propiedades') 
    }

    res.render('propiedades/agregar-imagen',{
        pagina:`Agregar Imagen para: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken()
    })
}

const almacenarImagen = async (req,res,next) => {
    
    const {id} = req.params;
     //validar que la propiedad exista
     const propiedad = await Propiedad.findByPk(id);
     if(!propiedad){
         return res.redirect('/api/v1/propiedades/mis-propiedades')
     }   
     //validar que la propiedad no este publicada
     if(propiedad.publicado){
         return res.redirect('/api/v1/propiedades/mis-propiedades')
     }
     // validar que la propiedad pertenece a quien visita esta pagina
     if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
         return res.redirect('/api/v1/propiedades/mis-propiedades') 
     }

     try{

         // almacenar imagen y publicar propiedad
      
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save();
        next() // se hace el redirect desde el js agregarImagen

     }catch(error){
        console.log(error)
     }
}
export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen
}