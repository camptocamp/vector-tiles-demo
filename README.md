# Guide to use this repo
## Requirements
* Your machine runs Linux !
* [git](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-linux-md) is installed
* [Docker](https://docs.docker.com/install/ is installed)
* docker-compose is installed (using docker_script.sh can be a workaround if you do not have docker-compose
* 80, 8000, 8080 are free ports on your machine

## Quick setup
### You do not have acces to Schweizmobil data
* Clone the repository
`git clone https://github.com/camptocamp/vector-tiles-demo.git` in a terminal
* launch the script which will run the app in a docker container
```
$ cd vector-tiles-demo
$ docker-compose up
```
in a terminal
### You have access to Schweizmobil data

* Requires [tippecanoe](https://github.com/mapbox/tippecanoe) to be installed
* Requires [ogr2ogr](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html) to be installed
* Clone the repository :
`git clone https://github.com/camptocamp/vector-tiles-demo.git` in a terminal
* move the data : routegeometry.shp, routegeometry.dbf, routegeometry.shx, routegeometry.prj into the vector-tiles-demo directory
* launch the script which will create the vector tiles from the data, and then launch the app in a docker container:
```
$ cd vector-tiles-demo
$ ./full_script.sh
```
#### Geoserver part

* Install [Geoserver](http://docs.geoserver.org/stable/en/user/installation/linux.html)
* Convert routegeometry data to wgs84 :
```
$ ogr2ogr -f "ESRI ShapeFile" routegeometry_light.shp -s_srs EPSG:21781 -t_srs EPSG:4326 -select land,route_id,surface routegeometry.shp
```
* change your start.ini file in geoserver to make it run on port 80

* [Publish a shapefile](http://docs.geoserver.org/latest/en/user/gettingstarted/shapefile-quickstart/index.html) workspace must be SchweizMobil, layer must be routegeometry_light

* Install [vector-tiles extension](file:///home/nhofer/geoserver-2.12.2/user/extensions/vectortiles/install.html), update the tile formats in tile caching tab (as in the link)

## See the awesome result :
* open a browser at http://localhost:8000

