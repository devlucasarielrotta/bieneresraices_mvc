(function(){
    const lat = document.querySelector('#lat').textContent || -34.6962100;
    const lng = document.querySelector('#lng').textContent || -58.3184910;
    const calle = document.querySelector('#calle').textContent;
    const mapa = L.map('mapa').setView([lat, lng], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    // agregar el pin

    L.marker([lat, lng]).addTo(mapa).bindPopup(calle)
    
})()