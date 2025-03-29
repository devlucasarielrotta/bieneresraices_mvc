import { Router } from "express";
import { formularioLogin, formularioOlvidePassword, formularioRegistro, registrar,confirmar , resetPassword,comprobarToken,nuevoPassword,autenticar} from "../controllers/usuarioController.js";

const router = Router();

// Routing
router.get('/login',formularioLogin)
router.post('/login',autenticar)

router.get('/registro',formularioRegistro)
router.post('/registro',registrar)

router.get('/confirmar/:token',confirmar)
router.get('/olvide-password',formularioOlvidePassword)
router.post('/olvide-password',resetPassword)

router.get('/olvide-password/:token',comprobarToken)
router.post('/olvide-password/:token',nuevoPassword)
// router.route('/')
//     .get((req,res) => {
//         res.send('Hola mundo en express');
//     })
//     .post('/nosotros',(req,res) => {
//         res.send('Hola mundo en express');
//     })
export default router