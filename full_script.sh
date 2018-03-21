#!/bin/bash

FILE_NAME_USED=routegeometry
LV95=_LV95
WM=_WM
EXTENSION=.json
OGRED=OGRED
cd data
#convert into GEOJSON LV95 from LV03 shapefile
FirstFile=$FILE_NAME_USED$LV95
echo "converting files into LV_95"
ogr2ogr -f "GeoJSON" $FirstFile$EXTENSION $FILE_NAME_USED.shp -s_srs EPSG:21781 -t_srs EPSG:2056 -select land,route_id,surface
wait
#Run python script to tweak coordinates into Web Mercator
echo "tweaking the file into fake WebMercator"
SecondFile=$FirstFile$WM
python3 ../lv95_web_swiss/lv95_web_swiss.py $FirstFile$EXTENSION $SecondFile$EXTENSION
#change header of file to make it look like web mercator
wait
ThirdFile=$SecondFile$OGRED
ogr2ogr -f "GeoJSON" $ThirdFile$EXTENSION -a_srs EPSG:3857 $SecondFile$EXTENSION
MBTILES=.mbtiles
wait
#Generates vector tiles at last !
echo "generating vector tiles"
tippecanoe -o $SecondFile$MBTILES -S 15 --drop-densest-as-needed -s EPSG:3857 --minimum-zoom=0 --maximum-zoom=13 -l route_layer $ThirdFile$EXTENSION
wait
cd ..
echo "lauching the server at localhost:8000"
docker-compose up

