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
    let question = rule
        .declarations.filter((x) => !x.property.startsWith('-')) // filter browser prefixes
        .map((declaration) => `${declaration.property}: ${declaration.value};`)
        .join(' ');

    if (
        /(padding|margin|height|width)/.test(module.name) &&
        /[a-z]\d+$/.test(selectorClean)
    ) {
        const step = Number(selectorClean.match(/\d+$/)[0]);
        let stepOrdinal;
        /* eslint-disable no-magic-numbers */
        if (step === 1) stepOrdinal = '1st';
        else if (step === 2) stepOrdinal = '2nd';
        else if (step === 3) stepOrdinal = '3rd';
        else stepOrdinal = `${step}th`;
        /* eslint-enable no-magic-numbers */
        if (step && step !== 0) question += ` /* ${stepOrdinal} step in size scale */`;
    }

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
