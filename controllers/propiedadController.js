const admin = (req,res) => {
    res.render('propiedades/admin',{
        pagina: 'Mis propiedades',
        barra:true
    })
}

// crear una nueva propiedades
const crear = (req,res) => {
    res.render('propiedades/crear',{
        pagina: 'Crear propiedades',
        barra:true
    })
}

export {
    admin,
    crear
}