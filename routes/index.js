import { Router } from 'express'
import usuarioRoutes from './usuarioRoutes.js'
import productosRoutes from './productosRoutes.js'


const router = Router();

router.use('/auth',usuarioRoutes)
router.use('/productos',productosRoutes)

export  default router