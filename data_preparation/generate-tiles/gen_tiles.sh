#/bin/bash

DATASET_PREFIX=data/routegeometry

OUTPUT_MBTILES=${DATASET_PREFIX}_LV95_WM.mbtiles

POI_DATASET_PREFIX=data/station-didok

echo "Generate vector tiles..."
tippecanoe -o ${OUTPUT_MBTILES} -S 5 --drop-densest-as-needed -s EPSG:3857 --minimum-zoom=0 --maximum-zoom=10 -l route_layer ${DATASET_PREFIX}_web_swiss_wrong_crs.geojson

echo "Generate vector tiles for POI..."
tippecanoe -f -o data/POI_SBB.mbtiles -s EPSG:3857 -r1 --minimum-zoom=0 --maximum-zoom=10 -l poi_sbb -y name -y verkehrsmittel ${POI_DATASET_PREFIX}_lv95_web_swiss.geojson

echo "Joining the tiles..."
tile-join -o data/CHMobility_poi_web_swiss.mbtiles  ${OUTPUT_MBTILES} data/POI_SBB.mbtiles
