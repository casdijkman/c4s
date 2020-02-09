'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const fs = require('fs');
const css = require('css');
const nunjucksRender = require('gulp-nunjucks-render');
const data = require('gulp-data');

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

function nunjucksCompile() {
    const myData = {
	css: css.parse(fs.readFileSync('dist/c4s-base.css', 'utf8'))
    };

    const manageEnv = (env) => {
	env.addFilter('getFileFromComment', (comment) => {
	    const regex = new RegExp('^line [0-9]*, (.*)');
	    const matches = regex.exec(comment.trim());
	    if (matches && matches.length === 2) {
		const path = matches[1];
		const pathParts = path.split('/');
		return pathParts[pathParts.length - 1];
	    } else {
		return null;
	    }
	})
    };

    return src('**/*.njk')
	.pipe(data(myData))
	.pipe(nunjucksRender({ manageEnv }))
	.pipe(dest('.'))
}

module.exports = {
    nunjucksCompile,
    build: series(clean, compileSassAll),
    default: series(clean, compileSassAll, watchSass)
}
