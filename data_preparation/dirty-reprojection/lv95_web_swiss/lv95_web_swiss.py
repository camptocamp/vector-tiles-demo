from __future__ import division
import json
import math
import sys

# Earth radius as defined in WGS 84, see e.g. https://en.wikipedia.org/wiki/World_Geodetic_System
WGS_84_RADIUS_METERS = 6378137
WGS_84_CIRCUMFERENCE_METERS = WGS_84_RADIUS_METERS * 2 * math.pi

SouthmostMerc = -WGS_84_CIRCUMFERENCE_METERS / 2
WestmostMerc = -WGS_84_CIRCUMFERENCE_METERS / 2

# Bounds of map.geo.admin in swiss projection
Westmost = 2420000
Southmost = 1030000
Eastmost = 2900000
Northmost = 1350000
scaleFactor = min(WGS_84_CIRCUMFERENCE_METERS / (Eastmost - Westmost),
                  WGS_84_CIRCUMFERENCE_METERS / (Northmost - Southmost))


def to_web_swiss(coordinates):
    web_swiss_x = ((coordinates[0] - Westmost) * scaleFactor) + WestmostMerc
    web_swiss_y = ((coordinates[1] - Southmost) * scaleFactor) + SouthmostMerc
    return [web_swiss_x, web_swiss_y]


def main():
    inFile = open(sys.argv[1], "r", encoding='utf-8')
    outFile = open(sys.argv[2], "w", encoding='utf-8')
    bigJSONObjects = json.load(inFile)
    features = bigJSONObjects["features"]
    for feature in features:
        geometry = feature["geometry"]
        if geometry["type"] == "Point":
            geometry["coordinates"] = to_web_swiss(geometry["coordinates"])
        else:
            geometry["coordinates"] = [to_web_swiss(coordinates) for coordinates in geometry["coordinates"]]
    json.dump(bigJSONObjects, outFile)


if __name__ == "__main__":
    main()
