import { check, validationResult } from 'express-validator'
import bcrypt from 'bcrypt' 
import Usuario from "../models/Usuario.js";
import { generarId , generarJWT} from '../helpers/tokens.js';
import { emailRegistro, emailOlvidePassword } from '../helpers/emails.js';

const formularioLogin = (req, res) => {
    
    res.render('auth/login', {
        pagina: 'Iniciar Sesión',
        csrfToken: req.csrfToken()
    });
}
const autenticar = async(req,res) => {
    // validacion en autenticar. 
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    
    
    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }

    const {email,password} = req.body;

    const usuario = await Usuario.findOne({where:{email}});

    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El usuario no existe'}],
        })
    }

    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'Tu cuenta aun no ha sido confirmada'}],
        })
    }

    // Revisar el password
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Iniciar Sesión',
            csrfToken: req.csrfToken(),
            errores: [{msg:'El password es incorrecto'}],
        })
    }

    // autenticar al usuario
    const token = generarJWT({id: usuario.id , nombre:usuario.nombre})

    // almacenar en un cooki

    return res.cookie('_token',token,{
        httpOnly: true,
        secure:true,
        sameSite: true
    }).redirect('/api/v1/propiedades/mis-propiedades')
    
   
}

const formularioRegistro = (req, res) => {

    res.render('auth/registro', {
        pagina: 'Crear Cuenta',
        csrfToken: req.csrfToken()
    });

}
const registrar = async (req, res) => {

    // validacion
    await check('nombre').notEmpty().withMessage('El nombre es obligatorio').run(req)
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)
    await check('password').isLength({ min: 6 }).withMessage('El password debe ser de al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Confirmar password debe ser igual a password').run(req)

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }
    const { nombre, email, password } = req.body
    // validacion de usuarios duplicados
    const existeUsuario = await Usuario.findOne({
        where: { email }
    })
    if (existeUsuario) {
        return res.render('auth/registro', {
            pagina: 'Crear Cuenta',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El usuario ya esta registrado' }],
            usuario: {
                nombre,
                email
            }
        })
    }

    // guardar usuario
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    // enviar email de confirmacion
    await emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

    // mensaje de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje: 'Hemos enviado un email de confirmación, presiona en el enlace para confirmar la cuenta'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auth/olvide-password', {
        pagina: 'Recupera tu acceso a bienes raices',
        csrfToken: req.csrfToken(),
    });
}

// confirmar una cuenta
const confirmar = async (req, res) => {
    const { token } = req.params
    const usuario = await Usuario.findOne({
        where: { token }
    })

    if (!usuario) {
        return res.render('auth/confirmar-cuenta', {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intenta nuevamente',
            error: true
        })
    }

    // confirmar cuenta
    usuario.token = null;
    usuario.confirmado = true;
    await usuario.save();

    res.render('auth/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La cuenta se confirmó correctamente',

    })
}

const resetPassword = async (req, res) => {
    // validacion
    await check('email').isEmail().withMessage('Eso no parece un email').run(req)

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),

        })
    }

    // buscar el usuario 
    const { email } = req.body;
    const usuario = await Usuario.findOne({ where: { email } })
    if (!usuario) {
        return res.render('auth/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            csrfToken: req.csrfToken(),
            errores: [{ msg: 'El email no pertenece a ningun usuario' }],
        })
    }

    // generar token y enviar email
    usuario.token = generarId();
    await usuario.save();


    //enviar email
    emailOlvidePassword({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    // mensaj de confirmacion
    res.render('templates/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje: 'Hemos enviado un email con las instrucciones',

    })

}

const comprobarToken = async (req, res) => {
    const { token } = req.params;

    const usuario = await Usuario.findOne({ where: { token } })
    if (!usuario) {
        res.render('templates/mensaje', {
            pagina: 'Reestablece tu password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    // formulario para modificar el password

    res.render('auth/reset-password', {
        pagina: 'Reestablece tu password',
        csrfToken: req.csrfToken()

    })
}
const nuevoPassword = async (req, res) => {
    // validar password
    await check('password').isLength({ min: 6 }).withMessage('El passowd debe ser de al menos 6 caracteres').run(req)

    let resultado = validationResult(req)

    if (!resultado.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Reestablece tu password',
            csrfToken: req.csrfToken(),
            errores: resultado.array(),
        })
    }
    // identificar quie nahce el cambio
    const { token } = req.params;
    const { password } = req.body;

    const usuario = await Usuario.findOne({ where: token })
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password, salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password reestablecida',
        mensaje: 'El password se guardo correctamente'
    })
    // hashear el password
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    formularioOlvidePassword,
    registrar,
    confirmar,
    resetPassword,
    comprobarToken,
    nuevoPassword
}