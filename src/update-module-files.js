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

glob.sync(`./modules/*${moduleFileSuffix}.scss`).forEach((file) => {
    fs.unlinkSync(file);
});

glob.sync('./modules/_*.scss').forEach((file) => {
    const basename = path.basename(file);
    const basenameClean = basename.replace(/^_/, '');
    const moduleName = basenameClean.replace(/\.scss$/, '');

    writeModuleFile({ moduleName });

    const module = modules.find((x) => x.name === moduleName);
    if (!module || !module.responsiveAble) return;

    writeModuleFile({ moduleName, responsive: true });
});

function moduleFileContent({ moduleName, responsive = false }) {
    return `/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

@use '../load-modules';

@include load-modules.load-modules(
  ('${moduleName}': ${responsive.toString()}),
  null
);
`;
}

function writeModuleFile({ moduleName, responsive = false }) {
    const name = `${moduleName}${responsive ? '-responsive' : ''}`;
    const filePath = `./modules/${name}${moduleFileSuffix}.scss`;
    fs.writeFileSync(filePath, moduleFileContent({ moduleName, responsive }));
}
