FROM ubuntu:16.04

RUN apt-get -yqq update && apt-get -yqq install python3

COPY . /opt
WORKDIR /opt
RUN mkdir data

CMD ./reproject.sh

