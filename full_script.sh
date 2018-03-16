#!/bin/bash
mkdir data
FILE_NAME_USED=routegeometry
LV95=_LV95
WM=_WM
EXTENSION=.json
OGRED=OGRED
mv "$FILE_NAME_USED.shp" "$FILE_NAME_USED.shx" "$FILE_NAME_USED.prj" "$FILE_NAME_USED.dbf" ./data
cd data
#convert into GEOJSON LV95 from LV03 shapefile
FirstFile=$FILE_NAME_USED$LV95
ogr2ogr -f "GeoJSON" $FirstFile$EXTENSION $FILE_NAME_USED.shp -s_srs EPSG:21781 -t_srs EPSG:2056 -select land,route_id,surface
#Run python script to tweak coordinates into Web Mercator
SecondFile=$FirstFile$WM
python3 ../script_trick_project_latlng.py $FirstFile$EXTENSION $SecondFile$EXTENSION
#present as FromWebMercator
ThirdFile=$SecondFile$OGRED
ogr2ogr -f "GeoJSON" $ThirdFile$EXTENSION -a_srs EPSG:3857 $SecondFile$EXTENSION
MBTILES=.mbtiles
#Generates vector tiles at last !
tippecanoe -o $SecondFile$MBTILES -S 15 --drop-densest-as-needed --minimum-zoom=0 --maximum-zoom=13 $ThirdFile$EXTENSION
cd ..
docker-compose up
