# specify the node base image with your desired version node:<version>
FROM node:10

# COPY . /home/node
WORKDIR /app

ENV http_proxy http://host.docker.internal:7890
ENV https_proxy http://host.docker.internal:7890
RUN echo 'Acquire::http::proxy "http://host.docker.internal:7890";' > /etc/apt/apt.conf.d/40proxy

RUN apt update
RUN apt install -y ruby ruby-dev
RUN gem install bundler

# RUN npm config set strict-ssl false
# RUN npm config set proxy http://host.docker.internal:7890
# RUN npm config set https-proxy http://host.docker.internal:7890

RUN npm install -g gulp-cli --registry=https://registry.npm.taobao.org
# RUN apt-get install -y libvips-dev --no-install-recommends
# RUN npm install --registry=https://registry.npm.taobao.org
# RUN npm install

# npm rebuild jpegtran-bin
# npm rebuild node-sass

# export LC_ALL=C.UTF-8
# export LANG=en_US.UTF-8
# export LANGUAGE=en_US.UTF-8
# bundle install
# bundle exec jekyll serve --host 0.0.0.0

# replace this with your application's default port
EXPOSE 4000


  # "proxies": {
  #   "default": {
  #     "httpProxy": "http://host.docker.internal:7890",
  #     "httpsProxy": "http://host.docker.internal:7890",
  #     "noProxy": "*.test.example.com,.example2.com"
  #   }
  # },

# docker image build -t jskyzero/node10:0.0.1 .
# docker container run -v C:\Users\jskyzero\workspace\blog\design.jskyzero.com\:/app -it -p 4000:4000 jskyzero/node10:0.0.1   /bin/bash
# docker cp ..\design.jskyzero.com\  upbeat_kepler:/home/node