import fs from 'fs'
import { validationResult } from "express-validator"
import { Precio, Categoria, Propiedad, Usuario } from '../models/index.js'
import { esVendedor, formatearFecha } from '../helpers/index.js'
import Mensaje from '../models/Mensaje.js'


const admin = async (req, res) => {

    // Leer querString
    const { pagina: paginaActual } = req.query;

    const expresion = /^[1-9]$/

    if (!expresion.test(paginaActual)) {
        return res.redirect('/api/v1/propiedades/mis-propiedades?pagina=1')
    }

    try {
        const { id } = req.usuario;

        const limite = 10;
        const offset = (paginaActual * limite) - limite;

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                offset,
                limit: limite,
                where: {
                    usuarioId: id
                },
                include: [
                    { model: Categoria, as: 'categoria' },
                    { model: Precio },
                    { model: Mensaje, as: 'mensajes' }
                ]
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])



        res.render('propiedades/admin', {
            pagina: 'Mis propiedades',
            propiedades,
            csrfToken: req.csrfToken(),
            paginas: Math.ceil(total / limite),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limite
        })
    } catch (error) {
        console.log(error)
    }
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
            datos: req.body
        })

    }

    try {
        const propiedadGuardada = await Propiedad.create({
            ...req.body,
            precioId: req.body.precio,
            categoriaId: req.body.categoria,
            usuarioId: req.usuario.id,
            imagen: ''
        })

        const { id } = propiedadGuardada;
        res.redirect(`/api/v1/propiedades/agregar-imagen/${id}`)
    } catch (error) {

    }

}

const agregarImagen = async (req, res) => {
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }
    //validar que la propiedad no este publicada
    if (propiedad.publicado) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }
    // validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    res.render('propiedades/agregar-imagen', {
        pagina: `Agregar Imagen para: ${propiedad.titulo}`,
        propiedad,
        csrfToken: req.csrfToken()
    })
}

const almacenarImagen = async (req, res, next) => {

    const { id } = req.params;
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }
    //validar que la propiedad no este publicada
    //  if(propiedad.publicado){
    //      return res.redirect('/api/v1/propiedades/mis-propiedades')
    //  }
    // validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    try {

        // almacenar imagen y publicar propiedad

        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save();
        next() // se hace el redirect desde el js agregarImagen

    } catch (error) {
        console.log(error)
    }
}

const editar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    const [precios, categorias] = await Promise.all([
        Precio.findAll(),
        Categoria.findAll()
    ])



    res.render('propiedades/editar', {
        pagina: `Editar propiedad ${propiedad.titulo}`,
        csrfToken: req.csrfToken(),
        categorias,
        precios,
        datos: propiedad
    })
}

const guardarCambios = async (req, res) => {

    //verificar validatcion
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {
        // Consultar modelo precio y categoria
        const [precios, categorias] = await Promise.all([
            Precio.findAll(),
            Categoria.findAll()
        ])

        return res.render('propiedades/editar', {
            pagina: `Editar propiedad`,
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            categorias,
            precios,
            datos: req.body
        })
    }
    const { id } = req.params;
    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    // // validar que la propiedad pertenece a quien visita esta pagina
    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    try {

        // reescribir ojbeto y actualizarlo
        propiedad.set({
            ...req.body
        })

        await propiedad.save();

        res.render('propiedades/agregar-imagen', {
            pagina: `Agregar Imagen para: ${propiedad.titulo}`,
            propiedad,
            csrfToken: req.csrfToken()
        })


    } catch (error) {
        console.log(error)
    }
}

const cambiarEstado = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    propiedad.publicado = !propiedad.publicado
    await propiedad.save()

    res.json({
        resultado: 'Ok'
    })
}

const eliminar = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id);

    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    // eliminar la imagen
    fs.unlinkSync(`public/uploads/${propiedad.imagen}`)

    // eliminar la propiedad
    await propiedad.destroy()

    res.redirect('/propiedades/mis-propiedades')
}

const mostrarPropiedad = async (req, res) => {
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio }
        ]
    });

    if (!propiedad || !propiedad.publicado) {
        return res.redirect('/404')
    }

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        propiedad,
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId)
    })
}
const enviarMensaje = async (req, res) => {
    const { id } = req.params;

    //validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            { model: Categoria, as: 'categoria' },
            { model: Precio }
        ]
    });

    if (!propiedad) {
        return res.redirect('/404')
    }
    let resultado = validationResult(req);

    if (!resultado.isEmpty()) {

        return res.render('propiedades/mostrar', {
            propiedad,
            pagina: propiedad.titulo,
            csrfToken: req.csrfToken(),
            usuario: req.usuario,
            esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
            errores: resultado.array()
        })
    }

    const { mensaje } = req.body;
    const { id: propiedadId } = req.params
    const { id: usuarioId } = req.usuario

    await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
    })

    res.render('propiedades/mostrar', {
        pagina: propiedad.titulo,
        csrfToken: req.csrfToken(),
        propiedad,
        usuario: req.usuario,
        esVendedor: esVendedor(req.usuario?.id, propiedad.usuarioId),
        enviado: true
    })
}


const verMensajes = async (req, res) => {
    const { id } = req.params;
    const propiedad = await Propiedad.findByPk(id, {
        include: [
            {
                model: Mensaje, as: 'mensajes',
                include: [{
                    model: Usuario.scope('eliminarPassword'), as: 'usuario'
                }]
            }]
    });

    if (!propiedad) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }

    if (req.usuario.id.toString() !== propiedad.usuarioId.toString()) {
        return res.redirect('/api/v1/propiedades/mis-propiedades')
    }


    res.render('propiedades/mensajes', {
        pagina: 'Mensajes',
        mensajes: propiedad.mensajes,
        formatearFecha
    })
}

export {
    admin,
    crear,
    guardar,
    agregarImagen,
    almacenarImagen,
    editar,
    guardarCambios,
    cambiarEstado,
    eliminar,
    mostrarPropiedad,
    enviarMensaje,
    verMensajes
}