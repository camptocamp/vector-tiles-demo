#!/bin/sh
set -ex

docker-compose -f prepare_data.yml build conversion
docker-compose -f prepare_data.yml build dirty-reprojection
docker-compose -f prepare_data.yml build generate-tiles
docker-compose -f prepare_data.yml run conversion
docker-compose -f prepare_data.yml run dirty-reprojection
docker-compose -f prepare_data.yml run generate-tiles
