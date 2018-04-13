import { inverseToWebSwiss } from './lv95-web-swiss';

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

function eventToHTMLString(L, ev, map) {
  const event = ev.originalEvent;
  const latlng = map.mouseEventToLatLng(event);
  const WebMercator = L.CRS.EPSG3857.project(latlng);
  const webSwissMercator = inverseToWebSwiss(WebMercator);
  return `screenCoordinates x : ${event.clientX} y :${event.clientY}<br />${
    JSON.stringify(latlng)}<br />
    WebMercator coords ${JSON.stringify(WebMercator)}<br />
    Fake WebMercator coords for mapbox-gl ${JSON.stringify(webSwissMercator)}
    Fake latlng ${JSON.stringify(L.CRS.EPSG3857.unproject(webSwissMercator))}`;
}

function toggleDemoMode(glMap) {
  changeButtonClass();
  toggleTileBoundaries(glMap);
  toggleVisible();
}

export { toggleDemoMode, eventToHTMLString };
