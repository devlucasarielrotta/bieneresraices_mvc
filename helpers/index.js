export const esVendedor = (usuarioId,propiedadUsuarioId) => {
    return usuarioId === propiedadUsuarioId
}

export const formatearFecha = fecha => {
    const date = new Date(fecha).toISOString().split('T')

    const opciones = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day:'numeric'
    }

    return new Date(date).toLocaleDateString('es-ES',opciones)
}