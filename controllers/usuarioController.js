import { check, validationResult } from 'express-validator'
import Usuario from "../models/Usuario.js";

const formularioLogin = (req, res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión '
    });
}
const formularioRegistro = (req, res) => {
    res.render('auth/registro', {
        pagina: 'Crear Cuenta'
    });
}
const registrar = async (req, res) => {

    // validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({min:6}).withMessage('El password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals('password').withMessage('Confirmar password debe ser igual a password').run(req)
    let resultado = validationResult(req)
    
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    const {nombre,email,password} = req.body
    // validacion de usuarios duplicados
    const existeUsuario = await Usuario.findOne({
        where: {email}
    })

    if(existeUsuario){
        return res.render('auth/registro',{
            pagina:'Crear Cuenta',
            errores: [{msg:'El usuario ya esta registrado'}],
            usuario: {
                nombre,
                email
            }
        })
    }
    const usuario = await Usuario.create(req.body)

    res.json(usuario)
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes raices'
    });
}


export {
    formularioLogin,
    formularioRegistro,
    formularioOlvidePassword,
    registrar
}