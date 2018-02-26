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

var light = true;
function changeLayer() {
    if (light){
        map.setStyle('mapbox://styles/mapbox/streets-v9');
    }else{
        map.setStyle('mapbox://styles/mapbox/light-v9');
    }
    light = !light;
}


function findMyHouse() {
    map.setCenter([6.086763,46.173795]);
    map.setZoom(18.35);
}
var mapzenAPIKey = "mapzen-q8G243k";
function addThirdPartyLayer(){
    map.addLayer({
        "id": "mapzentest",
        "type": "fill",
        "source": {
            "type" :"vector",
            "tiles":["https://vector.mapzen.com/osm/water/{z}/{x}/{y}.mvt?api_key="+mapzenAPIKey]
        },
        "source-layer":"water",
        "paint": {
            "fill-color": "#48D1CC" //my violet water
        }
    });
    console.log(map);
}
function setCustomStyle(){
    map.setStyle('basic_custom_style.json')
}
