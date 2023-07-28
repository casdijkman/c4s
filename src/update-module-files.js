#!/usr/bin/env node

/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
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

const moduleFileSuffix = '-module';

glob.sync(`./modules/*${moduleFileSuffix}.scss`).forEach((file) => {
  fs.unlinkSync(file);
});

const moduleFileContent = (name) => `/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

@use './${name}';

@include ${name}.${name};
`;

glob.sync('./modules/_*.scss').forEach((file) => {
    const basename = path.basename(file);
    const basenameClean = basename.replace(/^_/, '');
    const moduleName = basenameClean.replace(/\.scss$/, '');
    const newBasename = `${moduleName}${moduleFileSuffix}.scss`;
    const moduleFile = `./modules/${newBasename}`;

    fs.writeFileSync(moduleFile, moduleFileContent(moduleName));
});
