/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/* eslint-disable no-magic-numbers */
const partitionsOfTwelve = [
    [12], [11,1], [10,2], [10,1,1], [9,3], [9,2,1], [9,1,1,1], [8,4], [8,3,1], [8,2,2],
    [8,2,1,1], [8,1,1,1,1], [7,5], [7,4,1], [7,3,2], [7,3,1,1], [7,2,2,1], [7,2,1,1,1],
    [7,1,1,1,1,1], [6,6], [6,5,1], [6,4,2], [6,4,1,1], [6,3,3], [6,3,2,1], [6,3,1,1,1],
    [6,2,2,2], [6,2,2,1,1], [6,2,1,1,1,1], [6,1,1,1,1,1,1], [5,5,2], [5,5,1,1], [5,4,3],
    [5,4,2,1], [5,4,1,1,1], [5,3,3,1], [5,3,2,2], [5,3,2,1,1], [5,3,1,1,1,1], [5,2,2,2,1],
    [5,2,2,1,1,1], [5,2,1,1,1,1,1], [5,1,1,1,1,1,1,1], [4,4,4], [4,4,3,1], [4,4,2,2],
    [4,4,2,1,1], [4,4,1,1,1,1], [4,3,3,2], [4,3,3,1,1], [4,3,2,2,1], [4,3,2,1,1,1],
    [4,3,1,1,1,1,1], [4,2,2,2,2], [4,2,2,2,1,1], [4,2,2,1,1,1,1], [4,2,1,1,1,1,1,1],
    [4,1,1,1,1,1,1,1,1], [3,3,3,3], [3,3,3,2,1], [3,3,3,1,1,1], [3,3,2,2,2],
    [3,3,2,2,1,1], [3,3,2,1,1,1,1], [3,3,1,1,1,1,1,1], [3,2,2,2,2,1], [3,2,2,2,1,1,1],
    [3,2,2,1,1,1,1,1], [3,2,1,1,1,1,1,1,1], [3,1,1,1,1,1,1,1,1,1], [2,2,2,2,2,2],
    [2,2,2,2,2,1,1], [2,2,2,2,1,1,1,1], [2,2,2,1,1,1,1,1,1], [2,2,1,1,1,1,1,1,1,1],
    [2,1,1,1,1,1,1,1,1,1,1], [1,1,1,1,1,1,1,1,1,1,1,1]
];
/* eslint-enable no-magic-numbers */

function shuffle(array) {
    return array
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value);
}

function getRandomPartition() {
    const randomPartition = shuffle(partitionsOfTwelve)[0];
    return shuffle(randomPartition);
}

module.exports = {
    getRandomPartition
};