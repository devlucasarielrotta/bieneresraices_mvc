import { Router } from 'express'
import usuarioRoutes from './usuarioRoutes.js'
import productosRoutes from './propiedadesRoutes.js'


const router = Router();

router.use('/auth',usuarioRoutes)
router.use('/propiedades',productosRoutes)

export  default router