(function() {
    const lat = -34.6962100;
    const lng = -58.3184910;
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
    
     // Obtener info de la ubicación inicial y abrir popup
     geocodeService.reverse().latlng({ lat, lng }, 13).run(function(error, resultado) {
        if (error) {
            throw new Error(error.message);
        }
        marker.bindPopup(resultado.address.LongLabel).openPopup();
        document.querySelector('.calle').textContent = resultado.address?.Address ?? '';
        document.querySelector('#calle').value = resultado.address?.Address ?? '';
        document.querySelector('#lat').value = resultado.latlng?.lat ?? '';
        document.querySelector('#lng').value = resultado.latlng?.lng ?? '';
    });
    // detectar el pin 
    marker.on('moveend', function(e){
        marker = e.target
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat,posicion.lng))

        // obtener info de las calles al soltar pin
        geocodeService.reverse().latlng(posicion,13).run(function(error,resultado){
            if(error){
                throw new Error(error.message);
                
            }
            marker.bindPopup(resultado.address.LongLabel).openPopup()

            // llenar los campos de la calle
            document.querySelector('.calle').textContent = resultado.address?.Address ?? '';
            document.querySelector('#calle').value = resultado.address?.Address ?? '';
            document.querySelector('#lat').value = resultado.latlng?.lat ?? '';
            document.querySelector('#lng').value = resultado.latlng?.lng ?? '';
        })
    })
})()