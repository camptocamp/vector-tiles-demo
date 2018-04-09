# Guide to use this repo
## Requirements
* Your machine runs Linux !
* [git](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-linux-md) is installed
* [Docker](https://docs.docker.com/install/ is installed)
* docker-compose is installed (using docker_script.sh can be a workaround if you do not have docker-compose
* 8000, 8080 are free ports on your machine

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
* move the data : geometryroute_2018-02-16.tgz into the vector-tiles-demo/data directory (create it if it does not exist)
* download GeoJSON of SBB POI from this page `https://data.sbb.ch/explore/dataset/station-didok/export/` and put it in the vector-tiles-demo/data directory
* launch the script which will create the vector tiles from the data, and then launch the app in a docker container:
* launch a cors enabled server on port 7800 at vector-tile-demo/tiles/sprites
```
$ cd vector-tiles-demo
$ docker build -t nhofer/tile-demo .
$ ./prepare_data.sh
$ cd tiles
$ npm start
```

## See the awesome result :
* open a browser at http://localhost:8000

