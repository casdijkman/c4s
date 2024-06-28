// SPDX-FileCopyrightText: 2024 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const { complexModules } = require('../constants');

const checkComplex = ({ property, name, rule }) => {
    const propertyClean = property
        .replace(/^-(webkit|moz|o)-/, '')
        .replace(/^(min|max)-/, '')
        .replace(/-style$/, '')
        .replace(/-(top|right|bottom|left|x|y|shrink|grow)$/, '')
        .replace(/-(top|bottom)-(left|right)-/, '-');

    const nameClean = name
        .replace(/^hover-/, '')
        .replace(/-style$/, '') // .replace(/-(width|style)$/, '')
        .replace(/^(min|max)-/, '');
    const ignoreModules = [
        ...complexModules, 'table', 'border', 'measure',
    ];
    const complexSelectors = [/^\.clearfix/, /\.bg-animate/];


    if (
        ignoreModules.includes(name) ||
        complexSelectors.some((x) => x.test(rule.selectors[0]))
    ) {
        return;
    }
    console.assert(
        propertyClean === nameClean || propertyClean.replace(/-width/, '') === nameClean,
        'Unexpected complex selector', { name, nameClean, property, propertyClean }
    );
};

function checkComplexSelectors({ name, css }) {
    css.stylesheet.rules.forEach((rule) => {
        rule.declarations?.forEach((declaration) => {
            checkComplex({ property: declaration.property, name, rule });
        });
    });
}

module.exports = {
    checkComplexSelectors
};
