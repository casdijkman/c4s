const fs = require('fs');
const path = require('path');
const glob = require('glob');
const css = require('css');

function getNunjucksData() {
    const data = { files: [] };
    const cssFiles = glob.sync('dist/modules/**/*.css')
	  .filter((file) => ! /\.min\.css$/.test(file));

    for (const file of cssFiles) {
	data.files.push({
	    name: path.basename(file, '.css'),
	    css: css.parse(fs.readFileSync(file, 'utf8'))
	});
    }

    return data;
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
