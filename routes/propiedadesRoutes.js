import { Router } from "express";
import { body } from 'express-validator';
import { admin, cambiarEstado,crear,guardar, agregarImagen , almacenarImagen,editar,guardarCambios,eliminar, mostrarPropiedad, enviarMensaje, verMensajes} from "../controllers/propiedadController.js";
import upload from '../middleware/subirImagen.js'
import { identificarUsuario } from "../middleware/identificarUsuario.js";


const router = Router();

// Routing
router.get('/mis-propiedades', admin)
router.get('/crear', crear)
router.post('/crear', [
    body('titulo').notEmpty().withMessage('El título del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion del Anuncio es Obligatoria').isLength({max:200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitacioness'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

],guardar)

router.get('/agregar-imagen/:id',agregarImagen)
router.post('/agregar-imagen/:id',[
    upload.single('imagen')
],almacenarImagen)

router.get('/mis-propiedades/editar/:id',editar)

router.post('/mis-propiedades/editar/:id', [
    body('titulo').notEmpty().withMessage('El título del Anuncio es Obligatorio'),
    body('descripcion').notEmpty().withMessage('La descripcion del Anuncio es Obligatoria').isLength({max:200}).withMessage('La descripción es muy larga'),
    body('categoria').isNumeric().withMessage('Selecciona una categoria'),
    body('precio').isNumeric().withMessage('Selecciona un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Selecciona la cantidad de habitacioness'),
    body('estacionamiento').isNumeric().withMessage('Selecciona la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Selecciona la cantidad de baños'),
    body('lat').notEmpty().withMessage('Ubica la propiedad en el mapa'),

],guardarCambios)

router.post('/mis-propiedades/eliminar/:id',eliminar)

router.post('propiedad/:id',
    identificarUsuario,
    body('mensaje').isLength({min:10}).withMessage('El mensaje noi puede ir vacio o es muy corto'), 
    enviarMensaje)

router.get('/mensajes/:id',verMensajes)

router.put('/propiedades/:id',cambiarEstado)
export default router