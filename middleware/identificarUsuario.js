import jwt from 'jsonwebtoken'

import Usuario from '../models/Usuario.js'

export const identificarUsuario = async (req, res, next) => {

    const token = req.cookies._token
    if (!token) {
        req.usurio = null
        return next()
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        // alamacenar al usuario al req
        if (usuario) {
            req.usuario = usuario
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error)
        return res.clearCooki('_token').redirect('/auth/login')
    }
}