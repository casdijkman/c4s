// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cssLib = require('css');
const highlight = require('highlight.js');
const prettyBytes = require('pretty-bytes');
const loremIpsum = require('lorem-ipsum');

const { VERSION } = require('./constants');

function getNunjucksData() {
    const data = {
        files: [],
        VERSION
    };

    for (const file of glob.sync('dist/**/*.css')) {
        const baseName = path.basename(file);
        const name = baseName.split('.')[0];
        const fileClean = file.replace(/^dist/, '');
        const css = cssLib.parse(fs.readFileSync(file, 'utf8'));
        const size = fs.statSync(file).size;
        const gzipSize = fs.statSync(`${file}.gz`).size;

        // Remove comments from rules array
        css.stylesheet.rules = css.stylesheet.rules.filter((x) => x.type === 'rule');

        if (css.stylesheet.rules.length === 0) {
            console.warn('File has no rules:', name);
            continue;
        }

        data.files.push({
            name,
            baseName,
            file:           fileClean,
            isMain:         /^\/c4s/.test(fileClean),
            isModule:       /^\/modules\//.test(fileClean),
            isMinified:     /\.min\.css$/.test(fileClean),
            isRaw:          /\.raw\.css$/.test(fileClean),
            isCustom:       /-custom/.test(fileClean),
            size,
            sizePretty:     prettyBytes(size),
            gzipSize,
            gzipSizePretty: prettyBytes(gzipSize),
            css
        });
    }

    data.files.sort((a, b) => {
        if (! a.isMain || ! b.isMain || a.isCustom || b.isCustom) return 0;
        const order = ['', 'base', 's', 'm', 'l', 'h', 'p', 'prefixed'];
        const getValue = (file) => {
            const value = order.indexOf(file.name.replace(/^c4s-?/, ''));
            if (value === -1) console.warn(`[nunjucks.js] Could not sort file '${file.name}'`);
            return value;
        };
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

    env.addFilter('slug', (string) => {
        return string.toLowerCase()
            .replace(/[^ -~]/g, ' ')
            .replace(/[^0-9a-z]/g, ' ').trim()
            .replace(/ /g, '-')
            .replace(/-{2,}/g, '-');
    });

    env.addFilter('loremIpsum', (_, amountOfParagraphs = 1) => {
        return loremIpsum.loremIpsum({
            count: amountOfParagraphs,
            format: 'html',
            units: 'paragraphs'
        });
    });

    return env;
}

module.exports = {
    getNunjucksData,
    manageEnv: getNunjucksEnv
};
