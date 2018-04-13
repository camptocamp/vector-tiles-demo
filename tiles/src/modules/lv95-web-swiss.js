import { Point } from 'leaflet';

// Earth radius as defined in WGS 84, see e.g. https://en.wikipedia.org/wiki/World_Geodetic_System
const WGS_84_RADIUS_METERS = 6378137;
const WGS_84_CIRCUMFERENCE_METERS = WGS_84_RADIUS_METERS * 2 * Math.PI;

const SouthmostMerc = -WGS_84_CIRCUMFERENCE_METERS / 2;
const WestmostMerc = -WGS_84_CIRCUMFERENCE_METERS / 2;

const Westmost = 2420000;
const Southmost = 1030000;
const Eastmost = 2900000;
const Northmost = 1350000;
const scaleFactor = Math.min(
  WGS_84_CIRCUMFERENCE_METERS / (Eastmost - Westmost),
  WGS_84_CIRCUMFERENCE_METERS / (Northmost - Southmost),
);
function toWebSwiss(point) {
  return new Point(
    ((point.x - Westmost) * scaleFactor) + WestmostMerc,
    ((point.y - Southmost) * scaleFactor) + SouthmostMerc,
  );
}
function fromWebSwiss(point) {
  return new Point(
    ((point.x - WestmostMerc) / scaleFactor) + Westmost,
    ((point.y - SouthmostMerc) / scaleFactor) + Southmost,
  );
}

export { toWebSwiss, fromWebSwiss };
