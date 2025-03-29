(function() {
    const lat = -34.6962184;
    const lng = -58.3183898;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker; 

    // Provider y GeoCoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // el pin
    marker = new L.marker([lat,lng], {
        draggable: true,
        autoPan: true
    }).addTo(mapa)

    // detectar el pin 
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))

        // obtener info de las calles al soltar pin
        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){
            if(error){
                throw new Error(error.message)
            }
            console.log(resultado)
        })
    })
})()