// SPDX-FileCopyrightText: 2025 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const indentSpaces = 4;

module.exports = {
    env: {
        browser: true,
        es6: true,
        node: true
    },
    extends: 'eslint:recommended',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
    rules: {
        'indent': [
            'error',
            indentSpaces,
            {
                SwitchCase: 1
            }
        ],
        'no-extra-parens': 'error',
        'no-template-curly-in-string': 'error',
        'block-scoped-var': 'warn',
        'default-case': 'error',
        'dot-notation': 'error',
        'eqeqeq': 'error',
        'no-alert': 'warn',
        'no-empty-function': 'warn',
        'no-eval': 'error',
        'no-extend-native': 'warn',
        'no-floating-decimal': 'warn',
        'no-implicit-coercion': 'warn',
        'no-implied-eval': 'error',
        'no-iterator': 'error',
        'no-lone-blocks': 'warn',
        'no-loop-func': 'warn',
        'no-magic-numbers': [
            'error',
            {
                ignore: [-1, 0, 1, 10, 100, 1000],
                ignoreArrayIndexes: true
            }
        ],
        'no-multi-spaces': [
            'error',
            {
                ignoreEOLComments: true
            }
        ],
        'no-param-reassign': 'warn',
        'no-return-assign': 'warn',
        'no-self-compare': 'error',
        'no-useless-concat': 'warn',
        'no-useless-return': 'warn',
        'vars-on-top': 'warn',
        'wrap-iife': [
            'warn',
            'inside',
            {
                functionPrototypeMethods: true
            }
        ],
        'yoda': 'warn',
        'no-shadow': 'error',
        'no-undefined': 'error',
        'no-use-before-define': [
            'error',
            'nofunc'
        ],
        'camelcase': 'warn',
        'eol-last': 'error',
        'func-call-spacing': 'warn',
        'func-name-matching': 'warn',
        'func-style': [
            'error',
            'declaration',
            {
                allowArrowFunctions: true
            }
        ],
        'no-bitwise': 'warn',
        'no-lonely-if': 'error',
        'no-mixed-spaces-and-tabs': [
            'warn',
            'smart-tabs'
        ],
        'no-multiple-empty-lines': 'warn',
        'no-negated-condition': 'error',
        'no-nested-ternary': 'warn',
        'no-trailing-spaces': 'error',
        'no-unneeded-ternary': 'error',
        'no-whitespace-before-property': 'error',
        'semi': 'error',
        'semi-spacing': [
            'error',
            {
                before: false,
                after: true
            }
        ],
        'space-before-blocks': 'error',
        'spaced-comment': [
            'warn',
            'always',
            {
                block: {
                    exceptions: ['!']
                }
            }
        ],
        'switch-colon-spacing': [
            'error',
            {
                after: true,
                before: false
            }
        ],
        'template-tag-spacing': 'error',
        'arrow-parens': 'error',
        'arrow-spacing': [
            'error',
            {
                before: true,
                after: true
            }
        ],
        'no-duplicate-imports': 'error',
        'no-useless-rename': 'error',
        'no-var': 'error',
        'prefer-template': 'warn',
        'template-curly-spacing': 'error',
        'quotes': [
            'error',
            'single',
            {
                avoidEscape: true
            }
        ],
        'no-console': [
            'error',
            {
                allow: [
                    'warn',
                    'error',
                    'assert'
                ]
            }
        ],
        'space-before-function-paren': [
            'error',
            {
                anonymous: 'always',
                named: 'never'
            }
        ],
        'keyword-spacing': 'error',
        'operator-linebreak': [
            'error',
            'before',
        ],
        'quote-props': [
            'error',
            'consistent-as-needed'
        ],
        'object-curly-spacing': ['error', 'always'],
        'no-tabs' : 'error',
        'max-len': [
            'error',
            {
                code: 90,
                ignoreComments: true,
                ignoreTemplateLiterals: true
            }
        ],
        'no-unused-vars': [
            'error',
            {
                argsIgnorePattern: '^_',
                destructuredArrayIgnorePattern: '^_'
            }
        ],
        'array-bracket-spacing': [
            'error',
            'never'
        ],
        'padded-blocks': [
            'error',
            'never'
        ],
        'block-spacing': [
            'error',
            'always'
        ]
    }
};
