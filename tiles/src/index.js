import { Map } from 'leaflet';
import Swiss, { crs, latLngBounds, unproject } from 'leaflet-tilelayer-swiss';

import MapboxGL from './modules/mapbox-gl-leaflet-fork';
import { toWebSwiss } from './modules/lv95-web-swiss';
import { toggleDemoMode, eventToHTMLString } from './modules/debug_mode';

const switzerlandMobilityStyle = 'styles/SwitzerlandMobilityStyles/CHMobility_poi_web_swiss.json';


const map = new Map('map', {
  crs,
  layers: [new Swiss()],
  maxBounds: latLngBounds,
});

map.setView(unproject(L.point([2600000.0, 1200000.0])), 17);
const token = 'pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHViYWNnMjJzbXIyd3Q3MGI4emU5ZTAifQ.AKITUlaDoEzIkU2SGn6e1A';
// Adding the mapbox vector tiles layer
const gl = new MapboxGL({
  accessToken: token,
  style: switzerlandMobilityStyle,
  toWebMercator: toWebSwiss,
}).addTo(map);

map.on('mousemove', (ev) => {
  document.getElementById('info').innerHTML = eventToHTMLString(L, ev, map);
});
document.getElementById('debug-mode').addEventListener('click', () => {
  toggleDemoMode(gl._glMap);
});
