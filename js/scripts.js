// Mapa Leaflet
var mapa = L.map('mapid').setView([9.8, -84.25], 8);

var capa_osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', 
  {
    maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }
).addTo(mapa);	

// Segunda capa base
var capa_hot = L.tileLayer(
    'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', 
   {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
   }
).addTo(mapa);


	
// Conjunto de capas base
var capas_base = {
  "OSM": capa_osm,
  "OSM Forest" : capa_hot,

  
};  

// Control de capas
control_capas = L.control.layers(capas_base).addTo(mapa);	

// Control de escala
L.control.scale().addTo(mapa);

// Agregar capa WMS- Capa de Proviencias
var capa_prov = L.tileLayer.wms('https://geos.snitcr.go.cr/be/IGN_5/wfs', {
  layers: 'limiteprovincial_5k',
  format: 'image/png',
  transparent: true
}).addTo(mapa);

// Se agrega al control de capas como de tipo "overlay"
control_capas.addOverlay(capa_prov, 'Límite Provincia');

// Capa raster: datos tem diurna media
var capa_temp_diurna = L.imageOverlay("datos/2.png", 
	[[11.2159328521757722, -87.0970108884774277], 
	[5.4999767512137714, -82.5539392861543888]], 
	{opacity:0.5}
).addTo(mapa);
control_capas.addOverlay(capa_temp_diurna , 'Temperatura Diurna media');

// Capa raster: isotermalidad
var capa_isotermalidad = L.imageOverlay("datos/3.png", 
	[[11.2159328521757722, -87.0970108884774277], 
	[5.4999767512137714, -82.5539392861543888]], 
	{opacity:0.5}
).addTo(mapa);
control_capas.addOverlay(capa_isotermalidad , 'Isotermalidad');

// Capa de coropletas de cantones de la GAM
$.getJSON('https://francini-ap.github.io/datostarea03/evopo_cr.geojson', function (geojson) {
  var capa_evapo_cr = L.choropleth(geojson, {
	  valueProperty: 'RANGO',
	  scale: ['#9ebcda', '#8856a7'],
	  steps: 5,
	  mode: 'q',
	  style: {
	    color: '#fff',
	    weight: 2,
	    fillOpacity: 0.8
	  },
	  onEachFeature: function (feature, layer) {
	    layer.bindPopup('Cantón: ' + feature.properties.canton + '<br>' + 'Zonas urbanas: ' + feature.properties.RANGO.toLocaleString() + '%')
	  }
  }).addTo(mapa);
  control_capas.addOverlay(capa_evapo_cr, ' Rango evapotranspiración Media Anual');	

  // Leyenda de la capa de coropletas
  var leyenda = L.control({ position: 'bottomright' })
  leyenda.onAdd = function (mapa) {
    var div = L.DomUtil.create('div', 'info legend')
    var limits = capa_evapo_cr.options.limits
    var colors = capa_evapo_cr.options.colors
    var labels = []

    // Add min & max
    div.innerHTML = '<div class="labels"><div class="min">' + limits[0] + '</div> \
			<div class="max">' + limits[limits.length - 1] + '</div></div>'

    limits.forEach(function (limit, index) {
      labels.push('<li style="background-color: ' + colors[index] + '"></li>')
    })

    div.innerHTML += '<ul>' + labels.join('') + '</ul>'
    return div
  }
  leyenda.addTo(mapa)
});

function updateOpacityTemp() {
  document.getElementById("span-opacity-temp").innerHTML = document.getElementById("sld-opacity-temp").value;
  capa_temp_diurna .setOpacity(document.getElementById("sld-opacity-temp").value);
}
function updateOpacityIso() {
  document.getElementById("span-opacity-temp").innerHTML = document.getElementById("sld-opacity-temp").value;
  capa_isotermalidad .setOpacity(document.getElementById("sld-opacity-temp").value);
}


