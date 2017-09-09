const gulp = require('gulp');

const del = require('del');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');

// styles 
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const minifycss = require('gulp-csso');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const concat = require('gulp-concat');

// scripts
const gulpWebpack = require('gulp-webpack');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js')


/*--------------------------pathes--------------------------*/
const paths = {
    root: './dist',
    styles: {
        src: 'app/styles/**/*.scss',
        dest: 'dist/assets/styles/'
    },
    scripts: {
        src: 'app/scripts/**/*.js',
        dest: 'dist/assets/scripts/'
    },
    templates: {
        src: 'app/templates/**/*.pug',
        dest: 'dist/assets/'
    },
    images: {
        src: 'app/images/**/*.*',
        dest: 'dist/assets/images/'
    },
    fonts: {
        src: 'app/fonts/**/*.*',
        dest: 'dist/assets/fonts/'
    }
};

/*------------pathes to outer plugins and style libraries------------*/
let vendorCss = [
    'node_modules/normalize-css/normalize.css'
];

/*--------------------------pug--------------------------*/
function templates() {
    return gulp.src('./app/templates/pages/*.pug')
        .pipe(pug({ pretty: true }))
        .pipe(gulp.dest(paths.root));
}

/*--------------------------styles--------------------------*/
function styles() {
    return gulp.src('./app/styles/app.scss')
        .pipe(plumber({
            errorHandler: notify.onError(function (err){
                return {title: 'Style', message: err.message}
            })
        }))
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer('last 4 versions'))        
        .pipe(rename({suffix: '.min'}))
        .pipe(minifycss())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(paths.styles.dest))       
}

/*-------combining outer plugins and style libraries--------*/
function vendorCSS(){
    return gulp
        .src(vendorCss)
        .pipe(concat('vendor.min.css'))
        .pipe(gulp.dest(paths.styles.dest))
};
 
/*------------------------------webpack------------------------------*/
function scripts() {
    return gulp.src('app/scripts/app.js')
        .pipe(gulpWebpack(webpackConfig, webpack))
        .pipe(gulp.dest(paths.scripts.dest));
}

/*------------------------build folder cleaning------------------------*/
function clean() {
    return del(paths.root);
}

/*------------------------images transfer------------------------*/
function images() {
    return gulp.src(paths.images.src)
          .pipe(gulp.dest(paths.images.dest));
}

/*------------------------fonts transfer------------------------*/
function fonts() {
    return gulp.src(paths.fonts.src)
          .pipe(gulp.dest(paths.fonts.dest));
}

/*------------------------watcher------------------------*/
function watch() {
    gulp.watch(paths.scripts.src, scripts);
    gulp.watch(vendorCss, vendorCSS);
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.templates.src, templates);
    gulp.watch(paths.images.src, images, fonts);
}

/*------------------------server------------------------*/
function server() {
    browserSync.init({
        server: paths.root   
    });
    browserSync.watch(paths.root + '/**/*.*', browserSync.reload);
}

/*-------function exports to start them from the console-------*/
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.templates = templates;
exports.images = images;
exports.fonts = fonts;
exports.watch = watch;
exports.server = server;
exports.vendorCSS = vendorCSS;

/*------------------------build and watch------------------------*/
gulp.task('default', gulp.series(
    clean,
    gulp.parallel(styles, vendorCSS, scripts, templates, images, fonts),
    gulp.parallel(watch, server)
));
