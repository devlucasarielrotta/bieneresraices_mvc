import { Router } from 'express'
import usuarioRoutes from './usuarioRoutes.js'
import productosRoutes from './propiedadesRoutes.js'
import protegerRuta from '../middleware/protegerRuta.js';


const router = Router();

router.use('/auth',usuarioRoutes)
router.use(protegerRuta)
router.use('/propiedades',productosRoutes)

export  default router