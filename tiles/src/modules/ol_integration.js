/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import {SwissTopoStyle } from './mapinit';
import proj4 from "proj4";
import * as ol from "ol";
import View from 'ol/view';
import proj from 'ol/proj'
import TileLayer from 'ol/layer/tile';
import sourceWMTS from 'ol/source/wmts';
import Attribution from 'ol/attribution';
import olMap from 'ol/map';
import tilegridWMTS from 'ol/tilegrid/wmts';
import control from 'ol/control'

proj4.defs("EPSG:21781","+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=600000 +y_0=200000 +ellps=bessel +towgs84=674.4,15.1,405.3,0,0,0,0 +units=m +no_defs");
proj.setProj4(proj4);
mapboxgl.accessToken = "pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHk5ZjRyNDB0aWQycW82MW1vOWViY3EifQ.NgdjIOFkAmVECB1lTsySSg";

function attachOLMap(){
var resolutions = [
  4000, 3750, 3500, 3250, 3000, 2750, 2500, 2250, 2000, 1750, 1500, 1250,
  1000, 750, 650, 500, 250, 100, 50, 20, 10, 5, 2.5, 2, 1.5, 1, 0.5
];
var extent = [420000, 30000, 900000, 350000];
var projection = proj.get('EPSG:21781');
projection.setExtent(extent);

var matrixIds = [];
for (var i = 0; i < resolutions.length; i++) {
  matrixIds.push(i);
}

var attributions = [
  new Attribution({
    html: '<a href="https://www.geo.admin.ch/internet/geoportal/en/home.html">' +
      '&copy swisstopo / Amtliche Vermessung Schweiz/FL</a>'
  })
];

var wmtsCadastre = new TileLayer({
  source: new sourceWMTS(({
    layer: 'ch.kantone.cadastralwebmap-farbe',
    crossOrigin: 'anonymous',
    attributions: attributions,
    url:'//wmts10.geo.admin.ch/1.0.0/{Layer}/default/current/21781/{TileMatrix}/{TileRow}/{TileCol}.png',
    tileGrid: new tilegridWMTS({
      origin: [extent[0], extent[3]],
      resolutions: resolutions,
      matrixIds: matrixIds
    }),
    requestEncoding: 'REST'
  }))
});


var mapLeft = new olMap({
  target: 'map',
  layers: [wmtsCadastre],
  view: new View({
    center: [502160, 125800],
    projection: projection,
    resolution: 1
  }),
  controls: control.defaults({
    attributionOptions: ({
      collapsible: false
    })
  }),
  logo: false
});
};

export default attachOLMap