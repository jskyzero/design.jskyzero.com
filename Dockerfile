FROM ruby:2-alpine as jekyll


RUN apk add --no-cache build-base gcc bash cmake git
RUN gem install bundler jekyll


WORKDIR /home/node

COPY Gemfile jekyll-sleek.gemspec ./
# COPY  ./jekyll-sleek.gemspec
RUN bundle install --jobs 8


# FROM node:lts-alpine as gulp
# RUN npm install -g gulp-cli
# COPY ./package.json /home/node/package.json
# RUN npm install

EXPOSE 4000


CMD [ "bundle", "exec", "jekyll", "serve", "--force_polling", "-H", "0.0.0.0", "-P", "4000" ]

# docker image build . -t jskyzero/designer-notes
# docker run -p 8080:4000 -v C:\Users\jskyzero\workspace\blog\design.jskyzero.com:/home/node jskyzero/designer-notes