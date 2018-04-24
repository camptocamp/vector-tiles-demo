import { CRS } from 'leaflet';
import { project } from 'leaflet-tilelayer-swiss';
import { toWebSwiss } from './lv95-web-swiss';

function toggleTileBoundaries(glMap) {
  glMap.showTileBoundaries = !glMap.showTileBoundaries;
}

function toggleCollisionBoxes(glMap) {
  glMap.showCollisionBoxes = !glMap.showCollisionBoxes;
}

function toggleVisible() {
  const info = document.getElementById('info');
  if (info.style.display === 'block') {
    info.style.display = 'none';
  } else {
    info.style.display = 'block';
  }
}

function formatCoordinates(coordinates, decimals = 0) {
  return Object.entries(coordinates).map((keyValue) => {
    const [key, value] = keyValue;
    const roundedValue = value.toFixed(decimals);
    return `${key}: ${roundedValue}`;
  }).join(', ');
}

function eventToHTMLString(event, map) {
  const { originalEvent } = event;

  const latLng = map.mouseEventToLatLng(originalEvent);
  const webMercator = CRS.EPSG3857.project(latLng);
  const swissCoordinates = project(latLng);
  const webSwissMercator = toWebSwiss(swissCoordinates);
  const fakeLatLng = CRS.EPSG3857.unproject(webSwissMercator);

  const latLngPretty = formatCoordinates(latLng, 3);
  const WebMercatorPretty = formatCoordinates(webMercator);
  const swissCoordinatesPretty = formatCoordinates(swissCoordinates);
  const webSwissMercatorPretty = formatCoordinates(webSwissMercator);
  const fakeLatLngPretty = formatCoordinates(fakeLatLng, 5);

  return [
    `screenCoordinates x: ${originalEvent.clientX}, y: ${originalEvent.clientY}`,
    `${latLngPretty}`,
    `WebMercator coords ${WebMercatorPretty}`,
    `Swiss Coordinate (LV95) ${swissCoordinatesPretty}`,
    `Fake WebMercator coords for mapbox-gl ${webSwissMercatorPretty}`,
    `Fake latlng ${fakeLatLngPretty}`,
  ].join('<br>');
}

function toggleDemoMode(glMap) {
  toggleTileBoundaries(glMap);
  toggleCollisionBoxes(glMap);
  toggleVisible();
}

export { toggleDemoMode, eventToHTMLString };
