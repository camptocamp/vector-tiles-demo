import { Map, Point } from 'leaflet';
import Swiss, { crs, latLngBounds, unproject } from 'leaflet-tilelayer-swiss';

import MapboxGL from './modules/mapbox-gl-leaflet-fork';
import { addLayerControl, toggleLayers } from './modules/layer-control';
import { toWebSwiss } from './modules/lv95-web-swiss';
import { toggleDemoMode, eventToHTMLString } from './modules/debug_mode';

// Set up the mapbox vector tiles layer
const switzerlandMobilityStyle = 'styles/SwitzerlandMobilityStyles/CHMobility_poi_web_swiss.json';
const token = 'pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHViYWNnMjJzbXIyd3Q3MGI4emU5ZTAifQ.AKITUlaDoEzIkU2SGn6e1A';
const glLayer = new MapboxGL({
  accessToken: token,
  style: switzerlandMobilityStyle,
  toWebMercator: toWebSwiss,
});

// Set up swisstopo maps
const swissMapGray = new Swiss({
  layer: 'ch.swisstopo.pixelkarte-grau',
  opacity: 0.5,
});
const swissMapColor = new Swiss();
const swissImage = new Swiss({
  layer: 'ch.swisstopo.swissimage',
  maxZoom: 28,
});
const baseMaps = {
  'National Maps (gray)': swissMapGray,
  'National Maps (color)': swissMapColor,
  SWISSIMAGE: swissImage,
};

const map = new Map('map', {
  crs,
  layers: [swissMapGray, glLayer],
  minZoom: 13,
  maxBounds: latLngBounds,
});

map.setView(unproject(new Point(2600000.0, 1200000.0)), 17);

// Add layer control
const toggleControls = [
  {
    name: 'Debug mode',
    toggle: () => { toggleDemoMode(glLayer._glMap); },
  },
  {
    name: 'Hiking',
    toggle: () => { toggleLayers(glLayer._glMap, ['wanderweg', 'wanderweg-outline', 'wanderweg-dash']); },
    enabled: true,
  },
  {
    name: 'Biking',
    toggle: () => { toggleLayers(glLayer._glMap, ['velo', 'velo-outline']); },
    enabled: true,
  },
  {
    name: 'Stops (far)',
    toggle: () => { toggleLayers(glLayer._glMap, ['buses-far', 'trams-far', 'trains-far']); },
    enabled: true,
  },
  {
    name: 'Stops (close)',
    toggle: () => { toggleLayers(glLayer._glMap, ['buses', 'metros_et_trams', 'trains']); },
    enabled: true,
  },
];
addLayerControl(map, baseMaps, toggleControls);

// Update coordinates in debug mode
map.on('mousemove', (ev) => {
  document.getElementById('info').innerHTML = eventToHTMLString(ev, map);
});
