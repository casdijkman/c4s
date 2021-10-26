const fs = require('fs');
const path = require('path');
const glob = require('glob');
const cssLib = require('css');

function getNunjucksData() {
    const data = { modules: [] };
    const cssModules = glob.sync('dist/modules/**/*.css')
	  .filter((file) => ! /\.min\.css$/.test(file));

    for (const file of cssModules) {
	const name = path.basename(file, '.css');
	const css = cssLib.parse(fs.readFileSync(file, 'utf8'));
	// Remove comments from rules array
	css.stylesheet.rules = css.stylesheet.rules.filter((x) => x.type === 'rule');

	data.modules.push({
	    name,
	    file: file.replace(/^dist\/modules\//, ''),
	    css
	});
    }

    data.modules = data.modules.filter((x) => {
	const hasRules = x.css.stylesheet.rules.length > 0;
	if (!hasRules) console.warn('Module has no rules:', x.name);
	return hasRules;
    });

    return data;
}

function getNunjucksEnv(env) {
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
