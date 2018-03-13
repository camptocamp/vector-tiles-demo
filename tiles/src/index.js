import mapboxgl from 'mapbox-gl';
import * as buttonFunctions from './modules/buttonFunctions';
mapboxgl.accessToken = "pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHk5ZjRyNDB0aWQycW82MW1vOWViY3EifQ.NgdjIOFkAmVECB1lTsySSg";

var SwissTopoStyle = 'styles/SwissTopoHiking/wander_velo_spec.json'
var map = new mapboxgl.Map({
    style: SwissTopoStyle,
    center: [-74.0066, 40.7135],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    hash: true,
    container: 'map'
});


//bind functions to menu

var layerList = document.getElementById('menu');
var inputs = layerList.getElementsByTagName('input');

for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
}
//bind buttons to functions
document.getElementById("addWMS").addEventListener("click", buttonFunctions.addWMS);
document.getElementById("addWMTS").addEventListener("click", buttonFunctions.addWMTS);
document.getElementById("findMyHse").addEventListener("click", buttonFunctions.findMyHouse);
document.getElementById("addThirdPartyLr").addEventListener("click", 
buttonFunctions.addThirdPartyLayer);





