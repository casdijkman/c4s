const fs = require('fs');
const css = require('css');

function getNunjucksData() {
    return {
	css: css.parse(fs.readFileSync('dist/c4s-base.css', 'utf8'))
    };
}

function getNunjucksEnv(env) {
    env.addFilter('getFileFromComment', (comment) => {
	const regex = new RegExp('^line [0-9]*, (.*)');
	const matches = regex.exec(comment.trim());
	if (matches && matches.length === 2) { // eslint-disable-line no-magic-numbers
	    const path = matches[1];
	    const pathParts = path.split('/');
	    return pathParts[pathParts.length - 1];
	} else {
	    return null;
	}
    });

    return env;
}

module.exports = {
    getNunjucksData,
    manageEnv: getNunjucksEnv
};
