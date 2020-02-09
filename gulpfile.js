'use strict';

const { src, dest, watch, series, parallel } = require('gulp');
const sass = require('gulp-sass');
const rename = require('gulp-rename');
const del = require('del');
const fs = require('fs');
const css = require('css');

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

function parseCss(cb) {
    const file = fs.readFileSync('dist/c4s-base.css', 'utf8');
    const ast = css.parse(file);
    let json = JSON.stringify(ast, null, 2);
    json += '\n';
    //fs.writeFileSync('css.json', json);
    printCss(ast);
    cb();
}

function printCss(ast) {
    let cssFile = "";
    for (let rule of ast.stylesheet.rules.filter((x) => x.type === 'rule')) {
	let string = '';
	string += rule.selectors.join(',\n');
	string += ' {\n'
	rule.declarations.forEach((declaration, index) => {
	    string += `  ${declaration.property}: ${declaration.value};`;
	    if (index != rule.declarations.length - 1) string += '\n';
	})
	string += ' }\n\n';
	cssFile += string;
    }
    //fs.writeFileSync('css.css', cssFile);
}

module.exports = {
    parseCss,
    build: series(clean, compileSassAll),
    default: series(clean, compileSassAll, watchSass)
}
