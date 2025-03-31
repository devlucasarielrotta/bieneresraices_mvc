import jwt from 'jsonwebtoken';
import { Usuario } from '../models/index.js';

const protegerRuta = async(req,res,next) => {
    // verificar si hay token
    const { _token } = req.cookies;

    if(!_token){
        return res.redirect('/api/v1/auth/login')
    }
    // validar token
    try{
        const decoded = jwt.verify(_token,process.env.JWT_SECRET);
        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id);

        // alamacenar al usuario al req
        if(!usuario){
            return res.redirect('/api/v1/auth/login')
        }

        req.usuario = usuario;
        
        next();
    }catch(error){
        return res.clearCookie('_token').redirect('/api/v1/auth/login')
    }
   
}

export default protegerRuta;