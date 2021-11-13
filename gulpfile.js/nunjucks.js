// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cssLib = require('css');
const highlight = require('highlight.js');

function getNunjucksData() {
    const data = {
	files: [],
	version: require('../package.json').version
    };

    for (const file of glob.sync('dist/**/*.css')) {
	const baseName = path.basename(file);
	const name = baseName.split('.')[0];
	const css = cssLib.parse(fs.readFileSync(file, 'utf8'));

	// Remove comments from rules array
	css.stylesheet.rules = css.stylesheet.rules.filter((x) => x.type === 'rule');

	data.files.push({
	    name,
	    baseName,
	    file:       file.replace(/^dist/, ''),
	    isMain:     /c4s/.test(file),
	    isModule:   /module/.test(file),
	    isMinified: /.min.css$/.test(file),
	    isRaw:      /.raw.css$/.test(file),
	    isCustom:   /-custom./.test(file),
	    size:       fs.statSync(file).size,
	    gzipSize:   fs.statSync(`${file}.gz`).size,
	    css
	});
    }

    data.files = data.files.filter((x) => {
	const hasRules = x.css.stylesheet.rules.length > 0;
	if (!hasRules) console.warn('File has no rules:', x.name);
	return hasRules;
    });

    data.files.sort((a, b) => {
	const order = ['', 'base', 's', 'm', 'l', 'h', 'p', 'custom', 'prefixed'];
	const getValue = (file) => {
	    const value = order.indexOf(file.name.replace(/^c4s-?/, ''));
	    if (value >= 0) return value;
	    console.error(`Could not order file '${file.name}'`);
	};
	if (! a.isMain || ! b.isMain) return 0;
	return getValue(a) - getValue(b);
    });

    return data;
}

function getNunjucksEnv(env) {
    const getClassFromSelector = (selector) => {
	let cssClass = selector.split('+')[0].trim().split(':')[0].trim();
	cssClass = cssClass.replace('.', '');
	return cssClass;
    };

    env.addFilter('getClassFromSelector', getClassFromSelector);

    env.addFilter('getClassesFromSelectors', (selectors) => {
	return selectors.map((selector) => getClassFromSelector(selector));
    });

    env.addFilter('highlight', (textInput, languageInput) => {
	const text = textInput.replace(/&quot;/g, '"');
	const language = languageInput || 'css';
	return highlight.highlight(text, { language }).value;
    });

    env.addFilter('formatInteger', (integer) => {
	return new Intl.NumberFormat('en-GB').format(integer);
    });

    return env;
}

module.exports = {
    getNunjucksData,
    manageEnv: getNunjucksEnv
};
