#!/usr/bin/env node

/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

if (__dirname !== process.cwd()) {
    console.error("Run script from it's own directory");
    process.exit(1);
}

const glob = require('glob');
const fs = require('fs');
const path = require('path');
const modules = require('./module-list.json');

const moduleFileSuffix = '-module';
const moduleFile = (name, responsive = false) =>
    `./modules/${name}${responsive ? '-responsive' : ''}${moduleFileSuffix}.scss`;

glob.sync(`./modules/*${moduleFileSuffix}.scss`).forEach((file) => {
    fs.unlinkSync(file);
});

const moduleFileContent = (name, responsive = false) => `/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

@use '../load-modules';

@include load-modules.load-modules(
  ('${name}': ${responsive}),
  null
);
`;

glob.sync('./modules/_*.scss').forEach((file) => {
    const basename = path.basename(file);
    const basenameClean = basename.replace(/^_/, '');
    const moduleName = basenameClean.replace(/\.scss$/, '');

    fs.writeFileSync(moduleFile(moduleName), moduleFileContent(moduleName));

    const module = modules.find((x) => x.name === moduleName);
    if (!module || !module.responsiveAble) return;

    fs.writeFileSync(moduleFile(moduleName, true), moduleFileContent(moduleName, true));
});
