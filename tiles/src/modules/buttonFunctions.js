/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
import { map, SwissTopoStyle } from './mapinit';

function findMyHouse() {
  map.setCenter([6.086763, 46.173795]);
  map.setZoom(18.35);
}
function addThirdPartyLayer() {
  map.addSource('albaniaTiles', {
    type: 'vector',
    url: 'data/albania.mbtiles',
  });
  map.addLayer({
    id: 'openmapTilesAlbania',
    type: 'fill',
    source: 'albaniaTiles',
    'source-layer': 'water',
    paint: {
      'fill-color': '#ff00ff', // my violet water
    },
  });
}
function setMaputnikStyle() {
  map.setStyle('styles/my_first_maputnik_style.json');
}

function setMapboxStyle() {
  map.setStyle('mapbox://styles/nhofer/cje5h47heffe42rt50nvm7zyn');
}

// piece of wms in new york
function addWMS() {
  // would like to check the id of the layer we have got to put before
  // but since there is too many changesgit
  // var idOfFirstLayer = map.getStyle().layers[0].id
  map.addLayer({
    id: 'wms-test-layer',
    type: 'raster',
    source: {
      type: 'raster',
      tiles: [
        'https://geodata.state.nj.us/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=Natural2015',
      ],
      tileSize: 256,
    },
    paint: {},
  });
  map.setPaintProperty('wms-test-layer', 'raster-opacity', 0.5);
}

function setSchweizMobile() {
  map.setStyle(SwissTopoStyle);
}

const geoServerStyle = 'styles/SwissTopoHiking/geoserver_style_hiking.json';
function setGeoServerStyle() {
  map.setStyle(geoServerStyle);
}

function switchLayer(layer) {
  const layerId = layer.target.id;
  switch (layerId) {
    case 'basic':
    case 'streets':
      map.setStyle(`mapbox://styles/mapbox/${layerId}-v9`);
      break;
    case 'simple-custom-maputnik':
      setMaputnikStyle();
      break;
    case 'simple-custom-mapbox':
      setMapboxStyle();
      break;
    case 'schweiz-mobile-like':
      setSchweizMobile();
      break;
    case 'geo-server-demo':
      setGeoServerStyle();
      break;
    default:
      break;
  }
}


// swisstopodata
function addWMTS() {
  map.addSource('bauzonen', {
    attribution: '&copy; swisstopo',
    bounds: [
      5.140242,
      45.398181,
      11.47757,
      48.230651,
    ],
    maxzoom: 18,
    minzoom: 0,
    type: 'raster',
    tileSize: 256,
    tiles: [
      'https://wmts.geo.admin.ch/1.0.0/ch.are.bauzonen/default/current/3857/{z}/{x}/{y}.png',
    ],
  });

  map.addLayer({
    id: 'bauzonen',
    type: 'raster',
    source: 'bauzonen',
    minzoom: 0,
    maxzoom: 18,
    paint: {
      'raster-opacity': 0.3,
    },
  });
}

export {
  findMyHouse, addThirdPartyLayer, setMaputnikStyle, setMapboxStyle,
  addWMS, addWMTS, setSchweizMobile, switchLayer, map,
};
