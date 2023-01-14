import './style.css';
import Map from 'ol/Map.js';
import OSM from 'ol/source/OSM.js';
import TileLayer from 'ol/layer/Tile.js';
import View from 'ol/View.js';

/*Librerias para generar el punto*/
import {fromLonLat} from 'ol/proj';
import Feature from 'ol/Feature.js';
import Point from 'ol/geom/Point.js';
import VectorSource from 'ol/source/Vector.js';
import VectorLayer from 'ol/layer/Vector.js';

/*Importando estilo para el punto creado*/
import {Style, Fill, Circle} from 'ol/style.js';

/*Agregarle al punto y hacerlo interactivo*/
import Overlay from 'ol/Overlay.js';

const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: [0, 0],
    zoom: 2,
  }),
});

/*Codigo del punto*/
let latitud = -34.603722;
let longitud = -58.381592;

const lonLat = [longitud, latitud]; // coordenadas del punto
const point = new Point(fromLonLat(lonLat));
const feature = new Feature(point);
const vectorSource = new VectorSource({
  features: [feature]
});
const vectorLayer = new VectorLayer({
  source: vectorSource
});
map.addLayer(vectorLayer);

/*focalizar la vista en el punto*/
map.getView().animate({
  center: fromLonLat(lonLat),
  zoom: 10,
  duration: 2000
});

/*Dandole estilo al punto*/
const pointStyle = new Style({
  image: new Circle({
    fill: new Fill({
      color: 'blue'
    }),
    radius: 7
  }),
});
feature.setStyle(pointStyle);

// Crea un nuevo overlay para mostrar el cartel
const overlay = new Overlay({
  element: document.getElementById('popup'),
  positioning: 'bottom-center',
  stopEvent: false,
});

map.addOverlay(overlay);

// Agrega un evento "click" al punto
vectorLayer.getSource().on('change', function(e) {
  if (vectorLayer.getSource().getFeatures().length > 0) {
    vectorLayer.getSource().getFeatures()[0].set('name', 'Mi Punto');
    vectorLayer.getSource().getFeatures()[0].on('click', function(evt) {
      let feature = evt.target;
      let coord = feature.getGeometry().getCoordinates();
      let name = feature.get('name');
      alert("Hola");
      overlay.getElement().innerHTML = '<p>' + name + '</p>';
      overlay.setPosition(coord);
    });
  }
});