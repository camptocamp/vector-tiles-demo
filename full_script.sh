#!/bin/bash
mkdir data
mv route.* ./data
cd data
ogr2ogr -f "GeoJSON" routes_light.json route.shp -s_srs EPSG:21781 -t_srs EPSG:4326 -select land,title_en
tippecanoe -o wander_web.mbtiles --feature-filter-file=../filter_wander.json -S 15 --drop-densest-as-needed --minimum-zoom=5 --maximum-zoom=16 routes_light.json
cd ..
./docker_script.sh
