import dotenv from 'dotenv';
import express from 'express';
import csrf from 'csurf'
import cookieParser from 'cookie-parser';
import routes from './routes/index.js'
import db from './config/db.js'

dotenv.config();

// Crear la app 
const app = express();

// habilitar lectura datos del form
app.use(express.urlencoded({extended: true}))

// habilitar cookie Parser
app.use(cookieParser())

// habilitar CSRF
app.use(csrf({cookie:true}))

// conexion a la base de datos
try{
    await db.authenticate();
    db.sync()
    console.log('Conexion a la base de datos correcto')
}catch(error){
    console.log(error)
}

// Habilitar Pug
app.set('view engine','pug')
// habilitar carpeta de vista
app.set('views','./views')

// carpeta Publica 
app.use(express.static('public'))
// Routing
app.use('/api/v1',routes)




const port = process.env.PORT ?? 3000;

app.listen(port,() => {
    console.log(`servidor corriendo en http://localhost:${port}`);
})