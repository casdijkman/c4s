const maxLineLength = 92;

module.exports = {
    plugins: [
	'stylelint-scss'
    ],
    extends: 'stylelint-config-standard',
    rules: {
	'string-quotes': 'single',
	'at-rule-no-unknown': null,
	'scss/at-rule-no-unknown': true,
	'number-leading-zero': 'never',
	'block-opening-brace-space-before': null,
	'block-closing-brace-empty-line-before': null,
	'max-line-length': [
	    maxLineLength, {
		ignore: ['comments']
	    }
	],
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
	'block-closing-brace-newline-after': [
	    'always',
	    {
		ignoreAtRules: ['if', 'else']
	    }
	]
    }
};
