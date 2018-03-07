#!/bin/bash
docker  run  -it -v $(pwd):/data -dp 8080:80 --name SwissTopoTiles klokantech/tileserver-gl data/wander_web.mbtiles 
docker run -p 8000:8000 nhofer/tile-demo

