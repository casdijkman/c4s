'use strict';

const { src, dest, series, parallel } = require('gulp');
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

function compileMinifiedSass() {
    return src(globs.src.sass)
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(rename({
	    extname: ".min.css"
	}))
	.pipe(dest(destination))
}

function clean() {
    return del(destination)
}

module.exports = {
    default: series(clean, parallel(compileSass, compileMinifiedSass))
}
