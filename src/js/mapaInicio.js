(function(){
    const lat = -34.6962100; 
    const lng = -58.3184910;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);

    let markers = new L.FeatureGroup().addTo(mapa);
    let propiedades = [];
    const categoriasSelect = document.querySelector('#categorias');
    const preciosSelect = document.querySelector('#precios');
    const filtros = {
        categoria: '',
        precio: ''
    }

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    categoriasSelect.addEventListener('change', e => {
        filtros.categoria = e.target.value;
        filtrarPropiedades();
    });
    preciosSelect.addEventListener('change', e => {
        filtros.precio = e.target.value;
        filtrarPropiedades();
    });


    const obtenerPropiedades = async () => {
        try{
            const url = '/api/v1/propiedadesApi';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json(); 

            mostrarPropiedades(propiedades);
            
        }catch(error){
            console.error('Error al obtener las propiedades:', error);
        }
    }

    const mostrarPropiedades = (propiedades) => {
        markers.clearLayers();
        propiedades.forEach(propiedad => {
            //agregar los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng],{
                autoPan: true,
            })
                .addTo(mapa)
                .bindPopup(`
                    <p class="text-gray-600 mb-5">${propiedad?.categoria.nombre}</p>
                    <h1 class="text-xl font-bold uppercase my-2">${propiedad?.titulo}</h1>
                    <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad?.titulo}" class="w-full mb-5">
                    <p class="text-gray-600 font-bold mb-5">$${propiedad?.precio?.nombre}</p>
                    <a href="/propiedades/${propiedad.id}" class="text-blue-500">Ver Propiedad</a>
                `);
            markers.addLayer(marker);
     })}

    const filtrarPropiedades = () => {
        const resultado = propiedades.filter(filtrarCategorias).filter(filtrarPrecio);
        mostrarPropiedades(resultado)
    }

    const filtrarCategorias = (propiedad) => {
        return filtros.categoria ? propiedad.categoriaId === filtros.categoria : propiedad;
    }

    const filtrarPrecio = (propiedad) => {
        return filtros.precio ? propiedad.precioId === filtros.precio : propiedad;
    }
    obtenerPropiedades()
})()