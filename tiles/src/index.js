import * as L from 'leaflet';
import proj4 from 'proj4';
import proj4leaflet from 'proj4leaflet';

import './modules/mapbox-gl-leaflet-fork';

const SwissTopoStyle = 'styles/SwissTopoHiking/wander_velo_spec_one_layer_swiss_adaptedZoom.json';

// ////////////////////////////////////////////////////////////////////
// ////////////// Roman part leaflet-tilelayer-swiss //////////////////
// ////////////////////////////////////////////////////////////////////
// Definition for projected coordinate system CH1903+ / LV95 (EPSG:2056)
// Source: https://epsg.io/2056.js
const epsgCode = 'EPSG:2056';
const proj4Definition = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
        '+x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';

// Bounding box for tiles in EPSG:2056
// Source: https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
const topLeft = L.point(2420000, 1350000);
const bottomRight = L.point(2900000, 1030000);
const bounds = L.bounds(topLeft, bottomRight);

// Available resolutions
// Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
const resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
  750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1];

const crs = new L.Proj.CRS(epsgCode, proj4Definition, {
  bounds,
  origin: [topLeft.x, topLeft.y],
  resolutions,
});

function project(latLng) {
  return crs.projection.project(latLng);
}

function unproject(point) {
  return crs.projection.unproject(point);
}

const latLngBounds = L.latLngBounds(unproject(topLeft), unproject(bottomRight));

L.TileLayer.Swiss = L.TileLayer.extend({
  options: {
    attribution: 'Map data &copy; swisstopo',
    bounds: latLngBounds,
    format: 'jpeg',
    layer: 'ch.swisstopo.pixelkarte-farbe',
    maxZoom: 27,
    minZoom: 0,
    subdomains: '0123456789',
    timestamp: 'current',
  },
  initialize(options) {
    const newOptions = L.setOptions(this, options);
    const url = 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}';
    L.TileLayer.prototype.initialize.call(this, url, newOptions);
  },

});

L.TileLayer.Swiss.crs = crs;
L.TileLayer.Swiss.latLngBounds = latLngBounds;
L.TileLayer.Swiss.project = project;
L.TileLayer.Swiss.unproject = unproject;

L.tileLayer.swiss = function (options) {
  return new L.TileLayer.Swiss(options);
};
const layer = L.tileLayer.swiss();

const map = L.map('map', {
  crs: L.TileLayer.Swiss.crs,
  layers: [layer],
  maxBounds: L.TileLayer.Swiss.latLngBounds,
});

// ////////////////////////////////////////////////////////////////////////////////

// Adding the mapbox vector tiles layer

const token = 'pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHk5ZjRyNDB0aWQycW82MW1vOWViY3EifQ.NgdjIOFkAmVECB1lTsySSg';
map.setView(L.TileLayer.Swiss.unproject(L.point([2600000.0, 1200000.0])), 17);

const gl = L.mapboxGL({
  accessToken: token,
  style: SwissTopoStyle,
}).addTo(map);

// Boundaries of EPSG:3857

const WestmostMerc = -20026376.38;
const SouthmostMerc = -20048966.10;
const EastmostMerc = -WestmostMerc;
const NorthmostMerc = -SouthmostMerc;

// boundaries of switzerland WMTS in LV 95
// Taken from : https://api3.geo.admin.ch/services/sdiservices.html
const Westmost = 2420000;
const Southmost = 130000;
const Eastmost = 2900000;
const Northmost = 1350000;
const scaleFactor = Math.min(
  (EastmostMerc - WestmostMerc) / (Eastmost - Westmost),
  (NorthmostMerc - SouthmostMerc) / (Northmost - Southmost),
);

// functions used to retrieve the fake lat long on the mapbox layer
function LV95_to_EPSG3857(point) {
  return L.point([((point.x - Westmost) * scaleFactor) + WestmostMerc, 
    ((point.y - Southmost) * scaleFactor) + SouthmostMerc]);
}

function EPSG3857_to_Tricked_LatLng(topleft, bottomRight) {
  return L.latLngBounds(
    L.CRS.EPSG3857.unproject(topLeft),
    L.CRS.EPSG3857.unproject(bottomRight),
  );
}

function ArrayWSENFromBounds(bounds) {
  return [[Math.max(-180, bounds.getWest()), Math.max(-85.6, bounds.getSouth())],
    [Math.min(180, bounds.getEast()), Math.min(180, bounds.getNorth())]];
}

function getSwissCoordinates(map) {
  // maybe replace this by L.TileLayer.Swiss.unproject()
  const topLeft = project(map.getBounds().getNorthWest());
  const bottomRight = project(map.getBounds().getSouthEast());
  return [topLeft, bottomRight];
}

function getEPSG3857_Coordinates(points_LV95) {
  return [LV95_to_EPSG3857(points_LV95[0]), LV95_to_EPSG3857(points_LV95[1])];
}

const lv95 = getSwissCoordinates(map);
const epsg3857 = getEPSG3857_Coordinates(lv95);
const newLatLngBounds = L.latLngBounds(L.CRS.EPSG3857.unproject(epsg3857[0]), L.CRS.EPSG3857.unproject(epsg3857[1]));
const wsen = ArrayWSENFromBounds(newLatLngBounds);

gl._glMap.fitBounds(wsen);
