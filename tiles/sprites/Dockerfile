FROM ubuntu:16.04

RUN apt-get -yqq update && apt-get -yqq install python3

COPY . /var/app
WORKDIR /var/app

EXPOSE 7800

CMD ["python3", "simple-cors-http-server.py", "7800"]
