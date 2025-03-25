import { Router } from "express";
import { formularioLogin, formularioOlvidePassword, formularioRegistro, registrar } from "../controllers/usuarioController.js";

const router = Router();

// Routing
router.get('/login',formularioLogin)
router.get('/registro',formularioRegistro)
router.post('/registro',registrar)
router.get('/olvide-password',formularioOlvidePassword)
// router.route('/')
//     .get((req,res) => {
//         res.send('Hola mundo en express');
//     })
//     .post('/nosotros',(req,res) => {
//         res.send('Hola mundo en express');
//     })
export default router