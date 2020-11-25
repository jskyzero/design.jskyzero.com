# specify the node base image with your desired version node:<version>
FROM node:10

COPY . /home/node
WORKDIR /home/node

ENV http_proxy http://host.docker.internal:7890
ENV https_proxy http://host.docker.internal:7890
RUN echo 'Acquire::http::proxy "http://host.docker.internal:7890";' > /etc/apt/apt.conf.d/40proxy


RUN apt update
RUN apt install -y ruby ruby-dev
# RUN gem install jekyll bundler

# RUN npm config set strict-ssl false
# RUN npm config set proxy http://host.docker.internal:7890
# RUN npm config set https-proxy http://host.docker.internal:7890

# RUN npm install -g gulp-cli --registry=https://registry.npm.taobao.org

# RUN apt-get install -y libvips-dev --no-install-recommends
# RUN npm install --registry=https://registry.npm.taobao.org



# replace this with your application's default port
EXPOSE 4000


# docker image build -t node10 .
# docker container run -it  node10  /bin/bash