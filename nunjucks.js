const fs = require('fs');
const path = require('path');
const glob = require('glob');
const css = require('css');

function getNunjucksData() {
    const data = { files: [] };
    const cssFiles = glob.sync('dist/modules/**/*.css')
	  .filter((file) => ! /\.min\.css$/.test(file));

    for (const file of cssFiles) {
	const responsive = /\/responsive\//.test(file);
	let name = path.basename(file, '.css');
	name = responsive ? name.replace(/-base$/, '') : name;

	data.files.push({
	    name,
	    file,
	    responsive,
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
	    const fullPath = matches[1];
	    const pathParts = fullPath.split('/');
	    return pathParts[pathParts.length - 1];
	} else {
	    return null;
	}
    });

    const getClassFromSelector = (selector) => {
	let cssClass = selector.split('+')[0].trim().split(':')[0].trim();
	cssClass = cssClass.replace('.', '');
	return cssClass;
    };

    env.addFilter('getClassFromSelector', getClassFromSelector);

    env.addFilter('getClassesFromSelectors', (selectors) => {
	return selectors.map((selector) => getClassFromSelector(selector));
    });

    return env;
}

module.exports = {
    getNunjucksData,
    manageEnv: getNunjucksEnv
};
