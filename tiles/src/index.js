import { Map } from 'leaflet';
import Swiss, { crs, latLngBounds, project, unproject } from 'leaflet-tilelayer-swiss';

import MapboxGL from './modules/mapbox-gl-leaflet-fork';
import toWebSwiss from './modules/lv95-web-swiss';

const switzerlandMobilityStyle = 'styles/SwitzerlandMobilityStyles/hiking_poi_web_swiss.json';

const map = new Map('map', {
  crs,
  layers: [new Swiss()],
  maxBounds: latLngBounds,
});

map.setView(unproject(L.point([2600000.0, 1200000.0])), 17);
const token = 'pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHViYWNnMjJzbXIyd3Q3MGI4emU5ZTAifQ.AKITUlaDoEzIkU2SGn6e1A';
// Adding the mapbox vector tiles layer
new MapboxGL({
  accessToken: token,
  style: switzerlandMobilityStyle,
  toWebMercator: toWebSwiss,
}).addTo(map);
