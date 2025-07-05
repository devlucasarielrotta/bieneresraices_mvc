import { Router } from 'express'
import usuarioRoutes from './usuarioRoutes.js'
import propiedadesRoutes from './propiedadesRoutes.js'
import protegerRuta from '../middleware/protegerRuta.js';
import appRoutes from './appRoutes.js'
import apiRoutes from './apiRoutes.js'
const router = Router();

router.use('/',appRoutes)
router.use('/auth',usuarioRoutes)
router.use('/',apiRoutes)
router.use(protegerRuta)
router.use('/propiedades',propiedadesRoutes)
export  default router