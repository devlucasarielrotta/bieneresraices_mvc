import express from 'express';
import { inicio,categorias,noEncontrado,buscador } from '../controllers/appController.js';
import {  mostrarPropiedad} from '../controllers/propiedadController.js';
import { identificarUsuario } from "../middleware/identificarUsuario.js"; 
const router = express.Router();

// pagina de inicio
router.get('/', inicio);
// categorias
router.get('/categorias/:id', categorias);
// pagina 404
router.get('/404', noEncontrado);
// Buscador
router.post('/buscador', buscador);

// propiedades publicas
router.get('propiedad/:id',identificarUsuario, mostrarPropiedad)


export default router