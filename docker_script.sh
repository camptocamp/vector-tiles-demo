#!/bin/bash
docker  run  -it -v $(pwd):/data -dp 8080:80 --net tile-demo --name SwissTopoTiles klokantech/tileserver-gl data/wander_velo_spec.mbtiles 
docker run -p 8000:8000 nhofer/tile-demo

