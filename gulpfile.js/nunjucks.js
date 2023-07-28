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
const { getRandomPartition } = require('./partitions-of-12');
const { VERSION } = require('./constants');

const modulesFilePath = path.join(process.cwd(), 'src/module-list.json');
const modulesFile = fs.readFileSync(modulesFilePath, 'utf8');
const modules = JSON.parse(modulesFile);

const getOrder = (file) => {
    if (file.isMain && !file.isCustom) {
        let value = ['', 'base', 's', 'm', 'l', 'h', 'p', 'prefixed']
              .indexOf(file.name.replace(/^c4s-?/, ''));
        if (value === -1) console.warn(`[nunjucks.js] Could not sort '${file.name}'`);
        if (file.isMinified) value += 0.5; // eslint-disable-line no-magic-numbers
        return value;
    } else if (file.isModule) {
        const value = modules.map((x) => x.name).indexOf(file.name);
        if (value === -1) console.warn(`[nunjucks.js] Could not sort '${file.name}'`);
        return value;
    } else {
        return Number.POSITIVE_INFINITY;
    }
};

const getCss = (filePath, name) => {
    const css = cssLib.parse(fs.readFileSync(filePath, 'utf8'));
    // Remove comments from rules array
    css.stylesheet.rules = css.stylesheet.rules.filter((x) => x.type === 'rule');
    if (css.stylesheet.rules.length === 0) console.warn('File has no rules:', name);
    return css;
};

const files = glob.sync('dist/**/*.css')
      .map((filePath) => {
          const basename = path.basename(filePath);
          const name = basename.split('.')[0];
          const file = filePath.replace(/^dist/, '');
          const size = fs.statSync(filePath).size;
          const gzipSize = fs.statSync(`${filePath}.gz`).size;
          const object = {
              basename, name, file, size, gzipSize,
              css:            getCss(filePath, name),
              sizePretty:     prettyBytes(size),
              gzipSizePretty: prettyBytes(gzipSize),
              isMain:         /^\/c4s/.test(file),
              isModule:       /^\/modules\//.test(file),
              isMinified:     /\.min\.css$/.test(file),
              isRaw:          /\.raw\.css$/.test(file),
              isCustom:       /-custom/.test(file)
          };
          object.order = getOrder(object);

          if (object.isModule) {
              const module = modules.find((x) => x.name === name);
              object.isResponsive = module.isResponsive;
              object.responsiveAble = module.responsiveAble;
              object.isEnabled = module.isEnabled;
          }

          return object;
      })
      .sort((a, b) => a.order - b.order);

function getNunjucksEnv(env) {
    const getClassFromSelector = (selector) => {
        let cssClass = selector.split('+')[0].trim().split(':')[0].trim().split(' ')[0];
        cssClass = cssClass.replace(/^\./, '');
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

    env.addFilter('mySelect', (iterable, key, value) => {
        if (iterable === null || typeof iterable === 'undefined') return;

        if (Array.isArray(iterable)) {
            if (typeof value === 'undefined') {
                return iterable.filter((x) => {
                    return Object.prototype.hasOwnProperty.call(x, key);
                });
            } else {
                return iterable.filter((x) => x[key] === value);
            }
        } else if (typeof iterable === 'object') {
            return iterable[key];
        } else {
            throw new Error(`Error: Type of iterable not implemented: ${typeof iterable}`);
        }
    });

    env.addFilter('getRandomPartition', getRandomPartition);

    env.addFilter('imageToDataString', (image, imageType = 'png') => {
        if (!image) return '';
        const imagePath = path.join(__dirname, '..', image);
        if (!fs.existsSync(imagePath)) {
            console.error('Could not find image', imagePath);
            return;
        }
        const base64 = fs.readFileSync(imagePath).toString('base64');
        return `data:image/${imageType};base64,${base64}`;
    });

    return env;
}

module.exports = {
    getNunjucksData: () => ({ files, VERSION }),
    manageEnv: getNunjucksEnv
};
