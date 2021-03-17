# specify the node base image with your desired version node:<version>
FROM node:10

# ENV http_proxy http://host.docker.internal:7890
# ENV https_proxy http://host.docker.internal:7890
# RUN echo 'Acquire::http::proxy "http://host.docker.internal:7890";' > /etc/apt/apt.conf.d/40proxy

RUN echo "\
deb http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse\n\
deb http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ bionic main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-security main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-updates main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-proposed main restricted universe multiverse\n\
deb-src http://mirrors.aliyun.com/ubuntu/ bionic-backports main restricted universe multiverse" > /etc/apt/sources.list && \
apt-key adv --recv-keys --keyserver keyserver.ubuntu.com 3B4FE6ACC0B21F32

RUN apt update && \
  apt install -y --no-install-recommends\
  ruby \
  ruby-dev  \
  && rm -rf /var/lib/apt/lists/*

# RUN apt update && \
#   apt install -y --no-install-recommends\
#   libvips-dev libexif-gtk-dev\
#   && rm -rf /var/lib/apt/lists/*

RUN gem install --source https://gems.ruby-china.com/ bundler
RUN npm install -g gulp-cli --registry=https://registry.npm.taobao.org


WORKDIR /home/node
RUN echo "\
source \"https://gems.ruby-china.com/\"\n \
gemspec\n\
gem \"jekyll-mermaid\", \"~> 1.0\"\n\
gem \"kramdown-parser-gfm\"" > /home/node/Gemfile
COPY ./jekyll-sleek.gemspec /home/node/jekyll-sleek.gemspec
RUN bundle install

COPY ./package.json /home/node/package.json
# RUN npm install --registry=https://registry.npm.taobao.org --ignore-scripts
RUN npm install


# RUN npm config set strict-ssl false
# RUN npm config set proxy http://host.docker.internal:7890
# RUN npm config set https-proxy http://host.docker.internal:7890

# RUN npm install -g gulp-cli --registry=https://registry.npm.taobao.org
# RUN apt-get install -y libvips-dev --no-install-recommends
# RUN npm install --registry=https://registry.npm.taobao.org

# RUN npm rebuild node-sass
# RUN npm rebuild sharp
# RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=0 && npm rebuild puppeteer
# RUN npm rebuild gifsicle
# RUN npm rebuild jpegtran-bin
# RUN export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=0 && npm rebuild


# export LC_ALL=C.UTF-8
# export LANG=en_US.UTF-8
# export LANGUAGE=en_US.UTF-8
# bundle install
# bundle exec jekyll serve --host 0.0.0.0

# replace this with your application's default port


  # "proxies": {
  #   "default": {
  #     "httpProxy": "http://host.docker.internal:7890",
  #     "httpsProxy": "http://host.docker.internal:7890",
  #     "noProxy": "*.test.example.com,.example2.com"
  #   }
  # },

EXPOSE 4000


COPY . /home/node
# # Run the specified command within the container.
# CMD [ "bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0" ]

# docker image build -t jskyzero/node10:0.0.2 .
# docker container run -it -p 8000:4000 jskyzero/node10:0.0.2   /bin/bash
# bundle exec jekyll serve --host 0.0.0.0



# docker container run -v C:\Users\jskyzero\workspace\blog\design.jskyzero.com\:/app -it -p 4000:4000 jskyzero/node10:0.0.1   /bin/bash
# docker cp ..\design.jskyzero.com\  upbeat_kepler:/home/node