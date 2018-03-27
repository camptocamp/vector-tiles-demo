import { Map } from 'leaflet';
import Swiss, { crs, latLngBounds, project, unproject } from 'leaflet-tilelayer-swiss';

import MapboxGL from './modules/mapbox-gl-leaflet-fork';
import toWebSwiss from './modules/lv95-web-swiss';

const switzerlandMobilityStyle = 'styles/SwissTopoHiking/wander_velo_spec_one_layer_swiss_adaptedZoom.json';

const map = new Map('map', {
  crs,
  layers: [new Swiss()],
  maxBounds: latLngBounds,
});

map.setView(unproject(L.point([2600000.0, 1200000.0])), 17);

// Adding the mapbox vector tiles layer
new MapboxGL({
  style: switzerlandMobilityStyle,
  toWebMercator: toWebSwiss,
}).addTo(map);
