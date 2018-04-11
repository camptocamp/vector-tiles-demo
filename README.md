# Guide to use this repo
## Requirements
* Your machine runs Linux !
* [git](https://gist.github.com/derhuerst/1b15ff4652a867391f03#file-linux-md) is installed
* [Docker](https://docs.docker.com/install/ is installed)
* docker-compose is installed 
* 7800, 8000, 8080 are free ports on your machine

## Quick setup

### You already have SwitzerlandMobility data

* Clone the repository :
`git clone https://github.com/camptocamp/vector-tiles-demo.git` in a terminal
* move the data : geometryroute_2018-02-16.tgz into the vector-tiles-demo/data directory (create it if it does not exist)
* download GeoJSON of SBB POI from this page `https://data.sbb.ch/explore/dataset/station-didok/export/` and put it in the vector-tiles-demo/data directory
* go to the root directory of the project and type the following command
```
./build_all.sh
```

### You do not have SwitzerlandMobility data

* contact Kalaboum, if you are authorized to have acces to switzerland mobility data, he will provide you with a one-line command which starts the app

## See the awesome result :
* open a browser at http://localhost:8000

