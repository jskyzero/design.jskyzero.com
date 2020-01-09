# Designer-Notes

[![Build Status](https://travis-ci.com/jskyzero/design.jskyzero.com.svg?branch=jekyll)](https://travis-ci.com/jskyzero/design.jskyzero.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jskyzero/design.jskyzero.com)

jskyzero's notes about game designer.


![preview](assets/img/preview.jpg)


## How to use

You can view it via website, or you can download the source file and run in your local machine.

### Before

+ Jekyll: `gem install jekyll`
+ NodeJS (8 or greater)
+ Gulp CLI (optional, but recommended): `npm install --global gulp-cli`
    + [`Gulp exits with 'ReferenceError: internalBinding is not defined'`issues](https://github.com/gulpjs/gulp/issues/2246) 

### Install & Run

1. [Fork the repo](https://github.com/jskyzero/Designer-Notes/fork)
2. Clone or download the repo into directory of your choice: `git clone https://github.com/your-github-username/sleek.git`
3. Inside the directory run `bundle install` and `npm install`
4. If you want to use [gulp.js](https://gulpjs.com/) run `gulp` or `npm start`
    * if you don't want to use gulp you can run `bundle exec jekyll serve` instead

### Daily Use
+ serve: `bundle exec jekyll serve`
+ image/css: `gulp img` / `glup sass`
+ change file ext name: `for x in *.jpeg; do mv "$x" "${x%.jpeg}.jpg"; done`
