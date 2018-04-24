#!/bin/sh
set -ex

./prepare_data.sh
docker-compose up --build
