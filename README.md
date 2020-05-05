# Designer-Notes

[![Build Status](https://travis-ci.com/jskyzero/design.jskyzero.com.svg?branch=jekyll)](https://travis-ci.com/jskyzero/design.jskyzero.com)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/jskyzero/design.jskyzero.com)

jskyzero's notes about game designer.


![preview](https://lh3.googleusercontent.com/ZkEtoy_h4J4RxRq0Nvu7xrebqfA8fpIlrSXOJvryTkmxCvBDkXPWm2G2aEC4_QFtoZrWdpuY7eQaF9zCzyhpRUKXVy-uJQdLaiIkCVQEsQUYbzkfGAwZ3rnS9qvOaIyzeLSRiaK74EabSb9XRJMKX3636v43MU-p_hsMdAjC5HybBN-jpbWrk3Qb0btW-wIWDn3VINl-uzWs7NqfTmUqjyVsq2tXpQjKVQ5xQE2HB-j5D4kRv6M7P6Ind4MOuv9aYB8nt0MmRM9WqpdBQ8E9qSJ9hdiuIkTTVAz95_i2h--sLrvzXkj6k4g6-MR4upqsBH4ecEsQERu2DLGRhjCFVfAAfTKHKhaHHh-lyMXCU1JAG8r5Ls-LnNzvooLfK_yy8JMcRD1gIzBDuwj7leS_bng_3fzFsDAJTrKUXdPTgcFys2LjO3YkjDa1zaoZHR8tXOmi7R2n7OT4vM68u8vQVFI7XCDKU0jJvfaDWw8QP8kDabxZLx9oquK3o1s192PzRWt6W8kLTv44zqfed219yEpv6724vaRS5kBxs3G63NXi03l_DClr-GRyELY7P2Ph8FzNZAFJU4lku3c5zbyt1FwoqO-7pAf7WhHWPgRdlGAKCWUkoNQwmgtZk3slsWPuusSykm18L7xP3q1wUlcIdmqZx0YAqYj55Z0qyCykuAFqaFznwreI6DazR3FezyvpB9A9WOi0F19vpX1GGkBH0zu5N7e0NGx5a6iY_mf3WjhE_zyw0JRZUBY=w2001-h995-no)


## How to use

You can view it via [website](https://design.jskyzero.com/), or you can download the source file and run in your local machine.

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
+ mermaid: `./node_modules/.bin/mmdc -h`, `mmdc -i input.mmd -o output.svg`