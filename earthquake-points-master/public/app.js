const map = L.map('map', {
  center: [20.0, 5.0],
  minZoom: 2,
  zoomControl: false,
})

const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'

L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: cartodbAttribution
}).addTo(map)

L.tileLayer('http://localhost:8010/{z}/{x}/{y}.png', {}).addTo(map)

map.setView([0, 0], 0)
