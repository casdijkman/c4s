const fs = require('fs');
const { VERSION, complexModules } = require('../constants');
let currentId = 1;
const capitalizeWords = (sentence) => sentence.split(' ').map(
    (word) => word[0].toUpperCase() + word.substring(1)
).join(' ');

function constructQuestion({ rule, module }) {
    console.assert(
        Array.isArray(rule.selectors) && rule.selectors.length === 1,
        'Rule selectors.length is not 1'
    );
    const selectorClean = rule.selectors[0].replace(/^\./, '');
    const question = rule
        .declarations
        .map((declaration) => `${declaration.property}: ${declaration.value};`)
        .join(' ');

    return {
        id: currentId++,
        question,
        answer: selectorClean,
        categories: [module.name].map((x) => capitalizeWords(x)),
        url: `https://c4s.cdijkman.nl/example.html#${module.name}`
    };
}

function constructQuestionsFile(filesData) {
    const questions = [];
    const modules = filesData.filter((file) =>
        file.isModule && file.isRaw &&
        !complexModules.includes(file.name) && !/(color|hover)/.test(file.name)
    );

    modules.forEach((module) => {
        const rules = module.css.stylesheet.rules.filter((rule) => rule.type === 'rule');
        rules.forEach((rule) => questions.push(constructQuestion({ rule, module })));
    });

    writeQuestionsFile({ questions });
}

function writeQuestionsFile({ questions }) {
    // eslint-disable-next-line no-magic-numbers
    const exportString = JSON.stringify({ questions }, null, 2);
    const questionsFileContent = `/* eslint-disable */

// Questions for C4S pro quiz/game
// C4S version: ${VERSION}

module.exports = ${exportString};
`;
    fs.writeFileSync('c4s-pro-questions.js', questionsFileContent);
}

module.exports = {
    constructQuestionsFile
};
