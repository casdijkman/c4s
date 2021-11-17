// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

module.exports = {
    extends: [ './.stylelintrc.js' ],
    rules: {
        'at-rule-empty-line-before': null,
        'rule-empty-line-before': null,
        'number-leading-zero': 'always',
        'string-quotes': 'double',
        'max-line-length': null,
        'no-missing-end-of-source-newline': null,
        'value-list-comma-newline-after': null,
        'declaration-colon-newline-after': null,
        'comment-empty-line-before': null,
        'no-duplicate-selectors': null,
        'selector-list-comma-newline-after': null
    }
};
