// SPDX-FileCopyrightText: 2024 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const checkComplex = ({ property, name, rule }) => {
const propertyClean = property
    .replace(/^-(webkit|moz|o)-/, '')
        .replace(/^min-/, '')
        .replace(/-(width|style)$/, '')
        .replace(/-(top|right|bottom|left|x|y|shrink|grow)$/, '')
        .replace(/-(top|bottom)-(left|right)-/, '-');

    const nameClean = name.replace(/^hover-/, '').replace(/-(width|style)$/, '');
    const complexModules = [
        'complex', 'reset', 'miscellaneous', 'spanning-breakpoints', 'debug',
        'hover', 'coordinates', 'flex', 'grid',
        'table', 'border', 'measure',
    ];
    const complexSelectors = [/^\.clearfix/, /\.bg-animate/];

    const accept = complexModules.includes(name) ||
                   propertyClean === nameClean ||
                   complexSelectors.some((x) => x.test(rule.selectors[0]));
    if (!accept) console.warn(
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
