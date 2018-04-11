#!/bin/bash

DATASET_PREFIX=data/routegeometry
POI_DATASET_PREFIX=data/station-didok
INPUT_SHP_ARCHIVE=${DATASET_PREFIX}_2018-02-16.tgz
INPUT_SHP_FILE=export/routegeometry.shp

echo "Convert into GEOJSON LV95 from LV03 shapefile archive..."
ogr2ogr -f "GeoJSON" ${DATASET_PREFIX}_LV95.geojson /vsitar/${INPUT_SHP_ARCHIVE}/${INPUT_SHP_FILE} -s_srs EPSG:21781 -t_srs EPSG:2056 -select land,route_id,surface

echo "Converting POI SBB to projection LV95..."
ogr2ogr -f "GeoJSON" ${POI_DATASET_PREFIX}_lv95.geojson -s_srs EPSG:4326 -t_srs EPSG:2056 ${POI_DATASET_PREFIX}.geojson

