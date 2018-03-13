#!/bin/bash
mkdir data
FILE_NAME_USED=routegeometry
EXTENSION=_light.json
mv "$FILE_NAME_USED.shp" "$FILE_NAME_USED.shx" "$FILE_NAME_USED.prj" "$FILE_NAME_USED.dbf" ./data
cd data
ogr2ogr -f "GeoJSON" $FILE_NAME_USED$EXTENSION $FILE_NAME_USED.shp -s_srs EPSG:21781 -t_srs EPSG:4326 -select land,route_id,surface
tippecanoe -o wander_velo_spec.mbtiles -S 15 --drop-densest-as-needed --minimum-zoom=5 --maximum-zoom=16 $FILE_NAME_USED$EXTENSION
cd ..
docker-compose up
