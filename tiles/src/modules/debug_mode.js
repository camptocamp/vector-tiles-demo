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

function removeQuotes(anyString) {
  return anyString.replace(/"/g, '');
}

function eventToHTMLString(L, ev, map) {
  const event = ev.originalEvent;
  const latlng = map.mouseEventToLatLng(event);
  const WebMercator = L.CRS.EPSG3857.project(latlng);
  const webSwissMercator = fromWebSwiss(WebMercator);
  const fakeLatLng = L.CRS.EPSG3857.unproject(webSwissMercator);

  latlng.lat = latlng.lat.toFixed(3);
  latlng.lng = latlng.lng.toFixed(3);
  const latlngPretty = removeQuotes(JSON.stringify(latlng));

  WebMercator.x = Math.round(WebMercator.x);
  WebMercator.y = Math.round(WebMercator.y);
  const WebMercatorPretty = removeQuotes(JSON.stringify(WebMercator));

  webSwissMercator.x = Math.round(webSwissMercator.x);
  webSwissMercator.y = Math.round(webSwissMercator.y);
  const webSwissMercatorPretty = removeQuotes(JSON.stringify(webSwissMercator));

  fakeLatLng.lat = fakeLatLng.lat.toFixed(5);
  fakeLatLng.lng = fakeLatLng.lng.toFixed(5);
  const fakeLatLngPretty = removeQuotes(JSON.stringify(fakeLatLng));
  return `screenCoordinates x : ${event.clientX} y :${event.clientY}<br />${
    JSON.stringify(latlngPretty)}<br />
    WebMercator coords ${JSON.stringify(WebMercatorPretty)}<br />
    Fake WebMercator coords for mapbox-gl ${JSON.stringify(webSwissMercatorPretty)}
    Fake latlng ${JSON.stringify(fakeLatLngPretty)}`;
}

function toggleDemoMode(glMap) {
  changeButtonClass();
  toggleTileBoundaries(glMap);
  toggleVisible();
}

export { toggleDemoMode, eventToHTMLString };
