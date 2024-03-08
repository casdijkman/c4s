/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
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

module.exports = {
    getRandom12Partition,
    isCssProperty
};
