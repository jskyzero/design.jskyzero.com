'use strict';

// Gulp and node
const gulp = require('gulp');
// const cp = require('child_process');
const notify = require('gulp-notify');
const size = require('gulp-size');

// Basic workflow plugins
const browserSync = require('browser-sync');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const clean = require('gulp-clean');
const sass = require('gulp-sass')(require('sass'));
// const jekyll = process.platform === 'win32' ? 'jekyll.bat' : 'jekyll';
const messages = {
    jekyllBuild: '<span style="color: grey">Running:</span> $ jekyll build'
};

// Performance workflow plugins
const htmlmin = require('gulp-htmlmin');
const prefix = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const uglify = require('gulp-uglify');
const critical = require('critical');
// const sw = require('sw-precache');
const sw = require('workbox-build');

// Image Generation
const responsive = require('gulp-responsive');
const $ = require('gulp-load-plugins')();
const rename = require('gulp-rename');
const imagemin = require('gulp-imagemin');

const src = {
  css: '_sass/jekyll-sleek.scss',
  js: '_js/scripts.js',
}
const dist = {
  css: '_site/assets/css',
  js: '_site/assets/js',
}

function handleErrors() {
  var args = Array.prototype.slice.call(arguments);
  notify.onError({
    title: 'Compile Error',
    message: '<%= error.message %>'
  }).apply(this, args);
  this.emit('end'); // Keep gulp from hanging on this task
}

// // Build the Jekyll Site
// exports.jekyll_build = function(done) {
//     browserSync.notify(messages.jekyllBuild);
//     return cp.spawn( 'bundle', ['exec', 'jekyll', 'build'], {stdio: 'inherit'})
//         .on('close', done);
// });

// exports.deploy', ['jekyll-build'], function () {
//     return gulp.src('./_site/**/*')
//         .pipe(deploy());
// });

// // Rebuild Jekyll & do page reload
// exports.rebuild', ['jekyll-build'], function (done) {
//     browserSync.reload();
//     done();
// });

// // Serve after jekyll-build
// exports.browser-sync', ['sass', 'js', 'sw', 'jekyll-build'], function() {
//     browserSync({
//         server: {
//             baseDir: '_site'
//         }
//     });
// });

// SASS
function sassCSS() {
  return gulp.src(src.css)
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'compressed',
      includePaths: ['scss'],
    }).on('error', sass.logError))
    .pipe(sourcemaps.write({includeContent: false}))
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(prefix())
    .pipe(sourcemaps.write('./'))
    .pipe(rename({ basename: 'main' }))
    .pipe(gulp.dest(dist.css))
    .pipe(browserSync.reload({ stream: true }))
    .pipe(gulp.dest('assets/css'));
};
exports.sassCSS = sassCSS;

//  JS
function js() {
  return browserify(src.js, {debug: true, extensions: ['es6']})
    .transform('babelify', {presets: ["@babel/preset-env"]})
    .bundle()
    .on('error', handleErrors)
    .pipe(source('bundle.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(uglify())
    .pipe(sourcemaps.write('./'))
    .pipe(size())
    .pipe(gulp.dest(dist.js))
    .pipe(browserSync.reload({stream: true}))
    .pipe(gulp.dest('assets/js'))
};

exports.js = js;

exports.critical = function (cb) {
  critical.generate({
    base: '_site/',
    src: 'index.html',
    css: ['assets/css/main.css'],
    dimensions: [{
      width: 320,
      height: 480
    },{
      width: 768,
      height: 1024
    },{
      width: 1280,
      height: 960
    }],
    dest: '../_includes/critical.css',
    minify: true,
    extract: false,
    ignore: ['@font-face']
  });
};

exports.watch = function() {
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch(['*.html', '_layouts/*.html', '_includes/*.html', '_posts/*.md','_posts/**/*.md',  'pages_/*.md', '_include/*html'], ['rebuild']);
  gulp.watch(src.js, ['js']);
};

// exports.default', ['browser-sync', 'watch']);

// Minify HTML
function html() {
    gulp.src('./_site/index.html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./_site'))
    gulp.src('./_site/*/*html')
      .pipe(htmlmin({ collapseWhitespace: true }))
      .pipe(gulp.dest('./_site/./'))
};
exports.html = html;

function swjs() {
  // const rootDir ='./';
  const distDir = './_site';

  // sw.generateSW(`${rootDir}/sw.js`, {
  //   staticFileGlobs: [distDir + '/**/*.{js,html,css,png,jpg,svg}'],
  //   stripPrefix: distDir
  // });

  return sw.generateSW({
    globDirectory: 'build',
    globPatterns: [
      distDir + '**/*.{html,json,js,css}',
    ],
    swDest: `assets/js/sw.js`,

    // Define runtime caching rules.
    runtimeCaching: [{
      // Match any request that ends with .png, .jpg, .jpeg or .svg.
      urlPattern: /\.(?:png|jpg|jpeg|svg)$/,

      // Apply a cache-first strategy.
      handler: 'CacheFirst',

      options: {
        // Use a custom cache name.
        cacheName: 'images',

        // Only cache 100 images.
        expiration: {
          maxEntries: 100,
        },
      },
    }],
  });
};
exports.swjs = swjs;

// Images
function post_img() {
  return gulp.src('_img/posts/*.{png,jpg}')
    .pipe($.responsive({
      // For all the images in the folder
      '*': [{
        width: 230,
        rename: {suffix: '_placehold'},
      }, {
        // thubmnail
        width: 535,
        rename: { suffix: '_thumb' },
      }, {
        // thumbnail @2x
        width: 535 * 2,
        rename: { suffix: '_thumb@2x' },
      }, {
        width: 575,
        rename: { suffix: '_xs'}
      }, {
        width: 767,
        rename: {suffix: '_sm'}
      }, {
        width: 991,
        rename: { suffix: '_md' }
      }, {
        width: 1999,
        rename: { suffix: '_lg' }
      }, {
        // max-width hero
        width: 1920,
      }],
    }, {
      quality: 70,
      progressive: true,
      withMetadata: false,
    }))
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/posts/'));
};

function mv_img_1() {
  return gulp.src('assets/img/*.{png,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/'));
};

function mv_img_2() {
  return gulp.src('assets/img/**/*.{png,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/'));
};

function mv_img_3() {
  return gulp.src('assets/img/**/**/*.{png,jpg}')
    .pipe(imagemin())
    .pipe(gulp.dest('assets/img/'));
};

exports.mv_img = gulp.series(mv_img_1, mv_img_2, mv_img_3);
exports.img = gulp.series(post_img, mv_img_1, mv_img_2, mv_img_3);


exports.clean = function () {
    return gulp.src('_site', {read: false})
      .pipe(clean());
};

exports.serve = function() {
  browserSync({
    server: {
      baseDir: '_site'
    }
  });
};

exports.build = gulp.series(sassCSS, js, swjs);