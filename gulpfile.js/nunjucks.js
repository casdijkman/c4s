const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cssLib = require('css');

function getNunjucksData() {
    const data = { modules: [] };
    const cssModules = glob.sync('dist/modules/**/*.css')
	  .filter((file) => ! /\.min\.css$/.test(file));

    for (const file of cssModules) {
	const responsive = /\/responsive\//.test(file);
	const name = path.basename(file, '.css').replace(/-module$/, '');
	const css = cssLib.parse(fs.readFileSync(file, 'utf8'));
	// Remove comments from rules array
	css.stylesheet.rules = css.stylesheet.rules.filter((x) => x.type === 'rule');

	data.modules.push({
	    name,
	    file: file.replace(/^dist\/modules\//, ''),
	    responsive,
	    css
	});
    }

    // Remove modules that have no rules
    data.modules = data.modules.filter((x) => x.css.stylesheet.rules.length !== 0);

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
