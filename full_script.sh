#!/bin/bash

DATASET_PREFIX=data/routegeometry

INPUT_SHP_ARCHIVE=${DATASET_PREFIX}_2018-02-16.tgz
INPUT_SHP_FILE=export/routegeometry.shp
OUTPUT_MBTILES=${DATASET_PREFIX}_LV95_WM.mbtiles

echo "Convert into GEOJSON LV95 from LV03 shapefile archive..."
ogr2ogr -f "GeoJSON" ${DATASET_PREFIX}_LV95.geojson /vsitar/${INPUT_SHP_ARCHIVE}/${INPUT_SHP_FILE} -s_srs EPSG:21781 -t_srs EPSG:2056 -select land,route_id,surface

echo "Run python script to convert from LV95 to 'Web Swiss' (fake web mercator)..."
python3 lv95_web_swiss/lv95_web_swiss.py ${DATASET_PREFIX}_LV95.geojson ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

# Change header of file to make it look like web mercator
ogr2ogr -f "GeoJSON" ${DATASET_PREFIX}_web_swiss.geojson -a_srs EPSG:3857 ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Generate vector tiles..."
tippecanoe -o ${OUTPUT_MBTILES} -S 15 --drop-densest-as-needed -s EPSG:3857 --minimum-zoom=0 --maximum-zoom=13 -l route_layer ${DATASET_PREFIX}_web_swiss.geojson

echo "Lauching the server at localhost:8000..."
docker-compose up
