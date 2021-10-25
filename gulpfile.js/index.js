'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const { getNunjucksData, manageEnv } = require('./nunjucks');
const sass = require('gulp-sass')(require('sass'));
sass.compiler = require('sass');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const csso = require('gulp-csso');
const rename = require('gulp-rename');
const prettier = require('gulp-prettier');
const gzip = require('gulp-gzip');
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
    },
    dist: {
	css:      ['./dist/**/*.css', '!./dist/**/*.min.css'],
	cssAll:   './dist/**/*.css'
    }
};

const stylelintOptions = {
    reporters: [
	{ formatter: 'string', console: true }
    ],
    debug: true
};

function compileSass() {
    return src(globs.src.sass)
	.pipe(rename((path) => {
	    path.basename = path.basename.replace(/-module$/, '');
	}))
	.pipe(sass.sync().on('error', sass.logError))
	.pipe(postcss([ autoprefixer ]))
	.pipe(csso({ forceMediaMerge: true }))
	.pipe(rename({ extname: '.min.css' }))
	.pipe(dest(destination))           // Output optimized css files as .min.css
	.pipe(prettier())
	.pipe(rename({ extname: '' }))     // Remove .css extension (from .min.css)
	.pipe(rename({ extname: '.css' })) // Replace .min extension with .css
	.pipe(dest(destination));          // Output pretty-printed optimized files as .css
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
	    indent_size: 2,        // eslint-disable-line camelcase
	    end_with_newline: true // eslint-disable-line camelcase
	}))
	.pipe(dest(destination));
}

function lintSass() {
    return src(globs.src.sass)
	.pipe(stylelint(stylelintOptions));
}

function lintCss() {
    const options = stylelintOptions;
    options.config = require('../.stylelintrc.dist.js');
    return src(globs.dist.css)
	.pipe(stylelint(options));
}

function lintJs() {
    return src(['**/*.js', '!node_modules/**'])
	.pipe(eslint())
	.pipe(eslint.format())
	.pipe(eslint.failAfterError());
}

function gzipDist() {
    return src(globs.dist.cssAll)
	.pipe(gzip())
	.pipe(dest(destination));
}

function clean() {
    return del(destination);
}

const build = series(clean, compileSass, parallel(compileNunjucks, gzipDist));

function watchFiles() {
    watch(globs.src.sass, build);
    watch(globs.src.nunjucks, compileNunjucks);
}

module.exports = {
    nunjucks: compileNunjucks,
    sass: compileSass,
    clean,
    build,
    default: series(build, watchFiles),
    lint: parallel(lintSass, lintCss, lintJs)
};
