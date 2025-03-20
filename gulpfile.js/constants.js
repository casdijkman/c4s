// SPDX-FileCopyrightText: 2025 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

module.exports = {
    VERSION: require('../package.json').version,
    complexModules: [
        'complex', 'reset', 'forms', 'miscellaneous', 'spanning-breakpoints', 'debug',
        'hover', 'coordinates', 'flex', 'grid'
    ]
};
