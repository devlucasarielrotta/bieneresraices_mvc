import db from '../config/db.js';
import {Categoria,Precio} from '../models/index.js'
import Usuario from '../models/Usuario.js';
import categorias from "./categorias.js";
import precios from "./precios.js";

const importarDatos = async() => {
    try{
        //autenticar
        await db.authenticate()
        //generar las columnas
        await db.sync();
        // borramos todos los datos
        // db.truncate()
        // insertar los datos
        
        await Promise.all([Categoria.bulkCreate(categorias),Precio.bulkCreate(precios), await Usuario.create({
            nombre: 'lucas rotta',
            email: 'lucas@gmail.com',
            confirmado: true,
            password: '123456', // Recuerda encriptar esto en un sistema real
        })])

        console.log('Datos importados Correctamente');
        process.exit(0)
    }catch(error){
        console.log(error);
        process.exit(1)
        
        
    }
}

const eliminarDatos = async() => {
    try{
        // await Promise.all([
        //     Categoria.destroy({where:{}, truncate:true}),
        //     Precio.destroy({where:{}, truncate:true}),
        //     Usuario.destroy({where:{}, truncate:true}),
        // ])
        await db.sync({force:true})
        console.log('Datos eliminados correctamente')
        process.exit()
    }catch(error){
        console.log(error);
        process.exit(1)
    }
}

if(process.argv[2] === '-i'){
    await importarDatos()
}

if(process.argv[2] === '-d'){
    await eliminarDatos()
}