'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const { getNunjucksData, manageEnv } = require('./nunjucks');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

const base = 'src';
const destination = 'dist';

const globs = {
    src: {
	sass: `${base}/**/*.scss`
    }
};

function compileSass() {
    return src(globs.src.sass)
	.pipe(sass({ sourceComments: true }).on('error', sass.logError))
	.pipe(dest(destination));
}

function compileSassMinified() {
    return src(globs.src.sass)
	.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(dest(destination));
}

const compileSassAll = parallel(compileSass, compileSassMinified);

function clean() {
    return del(destination);
}

function watchSass() {
    return watch(globs.src.sass, compileSassAll);
}

function nunjucksCompile() {
    return src('**/*.njk')
	.pipe(data(getNunjucksData()))
	.pipe(nunjucksRender({ manageEnv }))
	.pipe(dest('.'));
}

function lintSass() {
    return src(globs.src.sass)
        .pipe(stylelint({
            reporters: [
                { formatter: 'string', console: true }
            ]
        }));
}

function lintJs() {
    return src(['**/*.js', '!node_modules/**', '!distribution/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}


module.exports = {
    nunjucksCompile,
    compileSassAll,
    clean,
    build: series(clean, compileSassAll),
    default: series(clean, compileSassAll, watchSass),
    lint: parallel(lintSass, lintJs)
};
