// SPDX-FileCopyrightText: 2024 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

module.exports = {
    plugins: [
        'stylelint-scss'
    ],
    extends: 'stylelint-config-standard-scss',
    rules: {
        'at-rule-no-unknown': null,
        'scss/at-rule-no-unknown': true,
        'block-opening-brace-space-before': null,
        'at-rule-empty-line-before': [
            'always' , {
                except: ['blockless-after-same-name-blockless'],
                ignore: ['first-nested', 'after-comment'],
                ignoreAtRules: ['else']
            }
        ],
        'rule-empty-line-before': [
            'always-multi-line',
            {
                ignore: ['first-nested', 'after-comment']
            }
        ],
        'scss/at-if-closing-brace-newline-after': 'always-last-in-chain',
        'scss/dollar-variable-empty-line-before': [
            'always', {
                except: ['first-nested'],
                ignore: ['after-dollar-variable', 'after-comment']
            }
        ]
    }
};
