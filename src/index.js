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

//piece of wms in new york
function addWMS() {
    // would like to check the id of the layer we have got to put before
    // but since there is too many changesgit 
    // var idOfFirstLayer = map.getStyle().layers[0].id   
        map.addLayer({
        'id': 'wms-test-layer',
        'type': 'raster',
        'source': {
            'type': 'raster',
            'tiles': [
                'https://geodata.state.nj.us/imagerywms/Natural2015?bbox={bbox-epsg-3857}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:3857&width=256&height=256&layers=Natural2015'
            ],
            'tileSize': 256
        },
        'paint': {}
    });
    map.setPaintProperty('wms-test-layer', 'raster-opacity', 0.5);
}

//swisstopodata
function addWMTS() {
map.addSource("bauzonen", {
        "attribution": "&copy; swisstopo",
        "bounds": [
            5.140242,
            45.398181,
            11.47757,
            48.230651
        ],
        "maxzoom": 18,
        "minzoom": 0,
        "type": "raster",
        "tileSize": 256,
        "tiles": [
            "https://wmts.geo.admin.ch/1.0.0/ch.are.bauzonen/default/current/3857/{z}/{x}/{y}.png"
        ]
    });

    map.addLayer({
        "id": "bauzonen",
        "type": "raster",
        "source": "bauzonen",
        "minzoom": 0,
        "maxzoom": 18,
        "paint": {
            "raster-opacity": 0.3,
        }
});
}
//bind buttons to functions
document.getElementById("addWMS").addEventListener("click", addWMS);
document.getElementById("addWMTS").addEventListener("click", addWMTS);
document.getElementById("setCustomStyleFromMapbox").
        addEventListener("click", setMapboxStyle);
document.getElementById("changeLr").addEventListener("click", changeLayer);
document.getElementById("findMyHse").addEventListener("click", findMyHouse);
document.getElementById("addThirdPartyLr").addEventListener("click", 
addThirdPartyLayer);
document.getElementById("setMaputnikSt").addEventListener("click", 
setMaputnikStyle);





