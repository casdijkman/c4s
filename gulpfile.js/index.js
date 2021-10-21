'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const { getNunjucksData, manageEnv } = require('./nunjucks');
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');
const rename = require('gulp-rename');
const del = require('del');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');
const htmlmin = require('gulp-htmlmin');
const beautifier = require('gulp-jsbeautifier');
const stylelint = require('gulp-stylelint');
const eslint = require('gulp-eslint');

const destination = 'dist';

const globs = {
    src: {
	sass:     './src/**/*.scss',
	nunjucks: './docs/pages/**/*.njk'
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
	.pipe(htmlmin({
	    removeComments: true,
	    collapseWhitespace: true
	}))
	.pipe(beautifier({
	    indent_size: 2, // eslint-disable-line camelcase
	    end_with_newline: true // eslint-disable-line camelcase
	}))
	.pipe(dest(destination));
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
    watch(globs.src.sass, build);
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
