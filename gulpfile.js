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

sass.compiler = require('sass');

const base = 'src';
const destination = 'dist';

const globs = {
    src: {
	sass: `${base}/**/*.scss`,
	nunjucks: '**/*.njk'
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

function compileNunjucks() {
    return src(globs.src.nunjucks)
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

function clean() {
    return del(destination);
}

const compileSassAll = parallel(compileSass, compileSassMinified);
const build = series(clean, compileSassAll, compileNunjucks);

function watchFiles() {
    watch(globs.src.sass, compileSassAll);
    watch(globs.src.nunjucks, compileNunjucks);
}

module.exports = {
    nunjucks: compileNunjucks,
    sass: compileSassAll,
    clean,
    build,
    default: series(build, watchFiles),
    lint: parallel(lintSass, lintJs)
};
