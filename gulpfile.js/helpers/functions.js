/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const { partitionsOfTwelve, cssProperties } = require('./data');

const shuffle = (array) => array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);


const getRandom12Partition = () => {
    const randomPartition = shuffle(partitionsOfTwelve)[0];
    return shuffle(randomPartition);
};

const isCssProperty = (name) => cssProperties.includes(name);

const capitalizeWords = (sentence) => sentence.split(' ').map(
    (word) => word[0].toUpperCase() + word.substring(1)
).join(' ');

function arrayHasDuplicates(array) {
    console.assert(Array.isArray(array), 'Value is not an array', array);
    return new Set(array).size !== array.length;
}

module.exports = {
    getRandom12Partition,
    isCssProperty,
    capitalizeWords,
    arrayHasDuplicates
};
