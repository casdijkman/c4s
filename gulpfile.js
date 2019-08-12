'use strict';

const { src, dest, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');

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

module.exports = {
    default: parallel(compileSass, compileMinifiedSass)
}
