#!/bin/bash
docker build -t nhofer/tile-demo .
docker stop SwissTopoTiles
docker rm SwissTopoTiles
./docker_script.sh
