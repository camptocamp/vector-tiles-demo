#!/bin/bash

DATASET_PREFIX=data/routegeometry
POI_DATASET_PREFIX=data/station-didok


echo "Run python script to convert from LV95 to 'Web Swiss' (fake web mercator)..."
python3 lv95_web_swiss/lv95_web_swiss.py ${DATASET_PREFIX}_LV95.geojson ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Run python script on POI SBB to convert from LV95 to 'Web Swiss' (fake web mercator)..."
python3 lv95_web_swiss/lv95_web_swiss.py ${POI_DATASET_PREFIX}_lv95.geojson ${POI_DATASET_PREFIX}_lv95_web_swiss.geojson
