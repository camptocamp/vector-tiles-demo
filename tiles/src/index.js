import proj4 from 'proj4'
import * as L from 'leaflet'
import proj4leaflet from 'proj4leaflet'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl-leaflet'

//////////////////////////////////////////////////////////////////////
//////////////// Roman part leaflet-tilelayer-swiss //////////////////
//////////////////////////////////////////////////////////////////////
   // Definition for projected coordinate system CH1903+ / LV95 (EPSG:2056)
    // Source: https://epsg.io/2056.js
    var epsgCode = 'EPSG:2056';
    var proj4Definition = '+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 ' +
        '+x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs';

    // Bounding box for tiles in EPSG:2056
    // Source: https://wmts.geo.admin.ch/EPSG/2056/1.0.0/WMTSCapabilities.xml
    var topLeft = L.point(2420000, 1350000);
    var bottomRight = L.point(2900000, 1030000);
    var bounds = L.bounds(topLeft, bottomRight);

    // Available resolutions
    // Source: https://api3.geo.admin.ch/services/sdiservices.html#wmts
    var resolutions = [4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250, 1000,
        750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5, 0.25, 0.1];

    var crs = new L.Proj.CRS(epsgCode, proj4Definition, {
        bounds: bounds,
        origin: [topLeft.x, topLeft.y],
        resolutions: resolutions
    });

    function project(latLng) {
        return crs.projection.project(latLng);
    }

    function unproject(point) {
        return crs.projection.unproject(point);
    }

    var latLngBounds = L.latLngBounds(unproject(topLeft), unproject(bottomRight));

   L.TileLayer.Swiss = L.TileLayer.extend({
        options: {
            attribution: 'Map data &copy; swisstopo',
            bounds: latLngBounds,
            format: 'jpeg',
            layer: 'ch.swisstopo.pixelkarte-farbe',
            maxZoom: 27,
            minZoom: 0,
            subdomains: '0123456789',
            timestamp: 'current'
        },
        initialize: function (options) {
            options = L.setOptions(this, options);
            var url = 'https://wmts{s}.geo.admin.ch/1.0.0/{layer}/default/{timestamp}/2056/{z}/{x}/{y}.{format}';
            L.TileLayer.prototype.initialize.call(this, url, options);
        }

    });

    L.TileLayer.Swiss.crs = crs;
    L.TileLayer.Swiss.latLngBounds = latLngBounds;
    L.TileLayer.Swiss.project = project;
    L.TileLayer.Swiss.unproject = unproject;

    L.tileLayer.swiss = function (options) {
        return new L.TileLayer.Swiss(options);
}
var layer = L.tileLayer.swiss();

var map = L.map("map", {
    crs: L.TileLayer.Swiss.crs,
    layers: [layer],
    maxBounds: L.TileLayer.Swiss.latLngBounds
});

var token = 'pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHk5ZjRyNDB0aWQycW82MW1vOWViY3EifQ.NgdjIOFkAmVECB1lTsySSg';
map.setView(L.TileLayer.Swiss.unproject(L.point([2600000, 1200000])), 16);
var gl = L.mapboxGL({
    accessToken: token,
    style: 'mapbox://styles/mapbox/bright-v8'
}).addTo(map);