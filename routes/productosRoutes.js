import { Router } from "express";

const router = Router();

// Routing
router.get('/',(req,res) => {
    res.send('Hola mundo en express producto');
})

router.post('/',(req,res) => {
    res.json({
        msg:'Respuesta de tipo post'
    });
})

// router.route('/')
//     .get((req,res) => {
//         res.send('Hola mundo en express');
//     })
//     .post('/nosotros',(req,res) => {
//         res.send('Hola mundo en express');
//     })
export default router