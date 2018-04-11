FROM ubuntu:16.04

RUN apt-get -yqq update && apt-get -yqq install software-properties-common python-software-properties
RUN add-apt-repository -y ppa:ubuntugis/ppa && apt-get update
RUN apt-get -yqq install gdal-bin


COPY conversion.sh /opt
WORKDIR /opt
RUN mkdir data
CMD ./conversion.sh
