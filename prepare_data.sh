#!/bin/bash

DATASET_PREFIX=data/routegeometry

INPUT_SHP_ARCHIVE=${DATASET_PREFIX}_2018-02-16.tgz
INPUT_SHP_FILE=export/routegeometry.shp
OUTPUT_MBTILES=${DATASET_PREFIX}_LV95_WM.mbtiles

POI_DATASET_PREFIX=data/station-didok

echo "Convert into GEOJSON LV95 from LV03 shapefile archive..."
ogr2ogr -f "GeoJSON" ${DATASET_PREFIX}_LV95.geojson /vsitar/${INPUT_SHP_ARCHIVE}/${INPUT_SHP_FILE} -s_srs EPSG:21781 -t_srs EPSG:2056 -select land,route_id,surface

echo "Run python script to convert from LV95 to 'Web Swiss' (fake web mercator)..."
python3 lv95_web_swiss/lv95_web_swiss.py ${DATASET_PREFIX}_LV95.geojson ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Converting POI SBB to projection LV95..."
ogr2ogr -f "GeoJSON" ${POI_DATASET_PREFIX}_lv95.geojson -s_srs EPSG:4326 -t_srs EPSG:2056 ${POI_DATASET_PREFIX}.geojson

echo "Run python script on POI SBB to convert from LV95 to 'Web Swiss' (fake web mercator)..."
python3 lv95_web_swiss/lv95_web_swiss.py ${POI_DATASET_PREFIX}_lv95.geojson ${POI_DATASET_PREFIX}_lv95_web_swiss.geojson

#The following line is not needed now since it only avoids a warning from tippecanoe
#Seee the script lv95_web_swiss to know what is really going on

# Change header of file to make it look like web mercator
#ogr2ogr -f "GeoJSON" ${DATASET_PREFIX}_web_swiss.geojson -a_srs EPSG:3857 ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Generate vector tiles..."
tippecanoe -o ${OUTPUT_MBTILES} -S 15 --drop-densest-as-needed -s EPSG:3857 --minimum-zoom=0 --maximum-zoom=13 -l route_layer ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Generate vector tiles for POI..."
tippecanoe -f -o data/POI_SBB.mbtiles -s EPSG:3857 -r1 --minimum-zoom=0 --maximum-zoom=13 -l poi_sbb -y name -y verkehrsmittel ${POI_DATASET_PREFIX}_lv95_web_swiss.geojson

echo "Joining the tiles..."
tile-join -o data/hiking_poi_web_swiss.mbtiles  ${OUTPUT_MBTILES} data/POI_SBB.mbtiles 

