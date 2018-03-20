import json
import sys
import math
inFile = open(sys.argv[1], "r")
outFile = open(sys.argv[2], "w")
bigJSONObjects = json.load(inFile)

#bounds of the mercator projection according to epsg.io/3857
WestmostMerc = -20026376.38
SouthmostMerc = -20048966.10
EastmostMerc = -WestmostMerc
NorthmostMerc = -SouthmostMerc

#bounds of map.geo.admin in swiss projection
Westmost = 2420000
Southmost  = 130000
Eastmost = 2900000
Northmost = 1350000
scaleFactor = min((EastmostMerc - WestmostMerc)/(Eastmost - Westmost),
                  (NorthmostMerc-SouthmostMerc)/(Northmost-Southmost))
#line added for number in other attributes than geometry
print(len(bigJSONObjects))
features = bigJSONObjects["features"]
for feature in features :
    geometry = feature["geometry"]
    coordinates = geometry["coordinates"]
    for coord in coordinates:
        coord[0] = ((coord[0]-Westmost) * scaleFactor) + WestmostMerc
        coord[1] = ((coord[1]-Southmost) * scaleFactor) + SouthmostMerc
json.dump(bigJSONObjects, outFile)

      
