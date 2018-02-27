import mapboxgl from 'mapbox-gl';
mapboxgl.accessToken = "pk.eyJ1IjoibmhvZmVyIiwiYSI6ImNqZHk5ZjRyNDB0aWQycW82MW1vOWViY3EifQ.NgdjIOFkAmVECB1lTsySSg";
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/light-v9',//'http://localhost:8000/styles/osm-bright/style.json',
    center: [-74.0066, 40.7135],
    zoom: 15.5,
    pitch: 45,
    bearing: -17.6,
    hash: true,
    container: 'map'
});

function findMyHouse() {
    map.setCenter([6.086763,46.173795]);
    map.setZoom(18.35);
}
function addThirdPartyLayer(){
    map.addSource("albaniaTiles", {
        "type" : "vector",
        "url" : "data/albania.mbtiles"
    });
    map.addLayer({
        "id": "openmapTilesAlbania",
        "type": "fill",
        "source":"albaniaTiles",
        "source-layer":"water",
        "paint": {
            "fill-color": "#ff00ff" //my violet water
        }
    });
    console.log(map);
}
function setMaputnikStyle(){
    map.setStyle('styles/my_first_maputnik_style.json');
}
var light = true;

function setMapboxStyle(){
    map.setStyle('mapbox://styles/nhofer/cje5h47heffe42rt50nvm7zyn');
}
function changeLayer() {
    if (light){
        map.setStyle('mapbox://styles/mapbox/streets-v9');
    }else{
        map.setStyle('mapbox://styles/mapbox/light-v9');
    }
    light = !light;
}
document.getElementById("setCustomStyleFromMapbox").
        addEventListener("click", setMapboxStyle);
document.getElementById("changeLr").addEventListener("click", changeLayer);
document.getElementById("findMyHse").addEventListener("click", findMyHouse);
document.getElementById("addThirdPartyLr").addEventListener("click", 
addThirdPartyLayer);
document.getElementById("setMaputnikSt").addEventListener("click", 
setMaputnikStyle);





