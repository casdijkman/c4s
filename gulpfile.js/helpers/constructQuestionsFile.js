// SPDX-FileCopyrightText: 2024 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

const fs = require('fs');
const ordinal = require('ordinal-numbers');
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
        .join('\n');
    const addStringToQuestion = (string) => { question = `/* ${string} */\n${question}`; };

    if (
        /[a-z]\d+$/.test(selectorClean) &&
        !/-([0-9]+x[0-9]+|n[0-9]+)$/.test(selectorClean)
    ) {
        const step = Number(selectorClean.match(/\d+$/)[0]);
        const negative = rule.declarations[0].value.startsWith('-');
        if (step && step !== 0) addStringToQuestion(
            `${ordinal(step)} step in size scale${negative ? ' (negative)' : ''}`
        );
    } else if (module.name === 'transition') {
        const speed = selectorClean.replace(/^transition-(transform-)?/, '');
        addStringToQuestion(`Speed: ${speed}`);
    } else if (module.name === 'box-shadow') {
        const size = selectorClean.replace(/^shadow-?/, '');
        Boolean(size) && addStringToQuestion(`Shadow size: ${size}`);
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

    writeQuestionsFile({ questions, version: VERSION });
}

function writeQuestionsFile(data) {
    // eslint-disable-next-line no-magic-numbers
    const exportString = JSON.stringify(data, null, 2);
    const questionsFileContent = `/* eslint-disable */

// Questions for C4S pro quiz/game
// C4S version: ${VERSION}

module.exports = ${exportString};
`;
    fs.writeFileSync('c4s-pro-data.js', questionsFileContent);
}

module.exports = {
    constructQuestionsFile
};
