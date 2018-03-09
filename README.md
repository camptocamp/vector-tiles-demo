# Guide to use this repo
## Requirements
* Your machine runs Linux !
* [git](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-linux-md) is installed
* [Docker](https://docs.docker.com/install/ is installed)
* 8000, 8080 are free ports on your machine

## Quick setup
### You do not have acces to Schweizmobil data
* Clone the repository
`git clone https://github.com/camptocamp/vector-tiles-demo.git` in a terminal
* launch the script which will run the app in a docker container
```
$ cd vector-tiles-demo
$ ./docker_script.sh
```
in a terminal
### You have access to Schweizmobil data

* Requires [tippecanoe](https://github.com/mapbox/tippecanoe) to be installed
* Requires [ogr2ogr](http://www.sarasafavi.com/installing-gdalogr-on-ubuntu.html) to be installed
* Clone the repository :
`git clone https://github.com/camptocamp/vector-tiles-demo.git` in a terminal
* move the data : geometryroute.shp, geometryroute.dbf, geometryroute.shx, geometryroute.prj into the vector-tiles-demo directory
* launch the script which will create the vector tiles from the data, and then launch the app in a docker container:
```
$ cd vector-tiles-demo
$ ./full_script.sh
```

## See the awesome result :
* open a browser at http://localhost:8000
