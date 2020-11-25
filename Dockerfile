# specify the node base image with your desired version node:<version>
FROM node:10

COPY . /home/node
WORKDIR /home/node

# ENV http_proxy http://host.docker.internal:7890
# ENV https_proxy http://host.docker.internal:7890
RUN echo 'Acquire::http::proxy "http://host.docker.internal:7890";' > /etc/apt/apt.conf.d/40proxy


RUN apt update
RUN apt install -y ruby ruby-dev
# RUN gem install jekyll bundler
RUN npm install -g gulp-cli
RUN npm install



# replace this with your application's default port
EXPOSE 4000


# docker image build -t node10 .
# docker container run -it  node10  /bin/bash