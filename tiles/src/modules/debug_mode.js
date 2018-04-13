import { fromWebSwiss } from './lv95-web-swiss';

function changeButtonClass() {
  document.getElementById('debug-mode').classList.toggle('down');
}

function toggleTileBoundaries(glMap) {
  glMap.showTileBoundaries = !glMap.showTileBoundaries;
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

function eventToHTMLString(L, event, map) {
  const { originalEvent } = event;

  const latLng = map.mouseEventToLatLng(originalEvent);
  const webMercator = L.CRS.EPSG3857.project(latLng);
  const webSwissMercator = fromWebSwiss(webMercator);
  const fakeLatLng = L.CRS.EPSG3857.unproject(webSwissMercator);

  const latLngPretty = formatCoordinates(latLng, 3);
  const WebMercatorPretty = formatCoordinates(webMercator);
  const webSwissMercatorPretty = formatCoordinates(webSwissMercator);
  const fakeLatLngPretty = formatCoordinates(fakeLatLng, 5);

  return [
    `screenCoordinates x: ${originalEvent.clientX}, y: ${originalEvent.clientY}`,
    `${latLngPretty}`,
    `WebMercator coords ${WebMercatorPretty}`,
    `Fake WebMercator coords for mapbox-gl ${webSwissMercatorPretty}`,
    `Fake latlng ${fakeLatLngPretty}`,
  ].join('<br>');
}

function toggleDemoMode(glMap) {
  changeButtonClass();
  toggleTileBoundaries(glMap);
  toggleVisible();
}

export { toggleDemoMode, eventToHTMLString };
