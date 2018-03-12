FROM ubuntu:16.04

RUN apt-get -yqq update
RUN apt-get -yqq install nodejs npm
RUN apt-get -yqq install curl
RUN apt-get -yqq install python3
RUN ln -s /usr/bin/nodejs /usr/bin/node

ADD tiles /opt/tile-demo
WORKDIR /opt/tile-demo

RUN node -v
RUN npm cache clean -f
RUN npm install -g n
RUN n 6.11.3
RUN npm install
RUN node -v
RUN npm run start


EXPOSE 8000

CMD ["python3", "-m" , "http.server"]


