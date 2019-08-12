'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');

const base = 'src';
const destination = 'dist';

const globs = {
    src: {
	sass: `${base}/**/*.scss`
    }
};

function compileSass() {
    return src(globs.src.sass)
	.pipe(sass().on('error', sass.logError))
	.pipe(dest(destination))
}

function compileSassMinified() {
    return src(globs.src.sass)
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(rename({ extname: ".min.css" }))
	.pipe(dest(destination))
}

const compileSassAll = parallel(compileSass, compileSassMinified);

function clean() {
    return del(destination)
}

function watchSass() {
    return watch(globs.src.sass, compileSassAll)
}

module.exports = {
    build: series(clean, compileSassAll),
    default: series(clean, compileSassAll, watchSass)
}
