// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const selectorClassPattern =
      '^(([a-z][a-z0-9]*)|(translate[XY]))(--?([a-z0-9]+|(translate[XY])))*$';

module.exports = {
    extends: [ './.stylelintrc.js' ],
    rules: {
        'alpha-value-notation': null,
        'at-rule-empty-line-before': null,
        'color-function-notation': null,
        'comment-empty-line-before': null,
        'declaration-colon-newline-after': null,
        'declaration-empty-line-before': null,
        'function-url-quotes': 'never',
        'indentation': null,
        'max-line-length': null,
        'media-feature-range-notation': 'prefix',
        'no-duplicate-selectors': null,
        'no-missing-end-of-source-newline': null,
        'number-max-precision': null,
        'property-no-vendor-prefix': null,
        'rule-empty-line-before': null,
        'scss/operator-no-newline-after': null,
        'scss/operator-no-unspaced': null,
        'selector-class-pattern': selectorClassPattern,
        'selector-list-comma-newline-after': null,
        'value-list-comma-newline-after': null
    }
};
