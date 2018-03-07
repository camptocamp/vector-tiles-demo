Requirements node v.6 with npm
Usage :
clone the repository,then :
############
$cd vector tiles demo
$npm -i
$npm run dev
############

run a local server on unused port (8000) :

################
$python3 -m http.server
################

open a browser at http://localhost:8000

------------------------------------

Schweizmobil data cannot be made public, to visualize the schweizmobil-style for those who have the data :
-Install tippecanoe
-Install tileserver-gl
-Install ogr2ogr

run the following commands for generating the tiles :

#################
#converts into geojson -> need also route.shx, route.prg, and route.dbf
$ogr2ogr -f "GeoJSON" routes.json route.shp -s_srs EPSG:21781 -t_srs EPSG:4326
#converts into utf-8, some tags have issue
$iconv -f ISO-8859-2 -t UTF-8 route.json -o routes_utf-8tile.json
#generates the tiles
#requires a filter (only need the land=wander for the hiking routes)
#the -S 15 allows to smooth line curves in low zoom
#last argument specifies for which zoom we generate the tiles
$tippecanoe -o my_file.mbtiles --feature-filter-file=filter_wander.json -S 15 --drop-densest-as-needed --minimum-zoom=5 --maximum-zoom=16 routes_utf-8.json
#runs tileserver to provide the tile on localhost:8080
$tileserver-gl my_file.mbtiles