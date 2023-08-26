/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import modules from '../../src/module-list.json';
import { debugLog } from './helpers/constants';

const form = document.querySelector('.js-custom-modules-form');
const output = document.querySelector('.js-custom-modules-output');
const separator = '|';

const filterModules = (filterArray) => {
    const responsiveSuffix = '-responsive';

    return filterArray
        .filter((moduleName) => {
            const moduleNameIsResponsive = moduleName.endsWith(responsiveSuffix);
            const moduleNameClean = moduleName.replace(new RegExp(`${responsiveSuffix}$`), '');
            const foundModule = modules.find((x) => x.name === moduleNameClean);
            if (!foundModule) {
                console.error('Could not find module', moduleName);
                return false;
            }
            if (moduleNameIsResponsive && !foundModule.responsiveAble) {
                console.error('Module is not responsive', moduleName);
                return false;
            }
            return true;
        })
        .filter((moduleName) => !filterArray.includes(`${moduleName}${responsiveSuffix}`));
};

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const selectedModules = new Array();
    let minify = false;
    for (let entry of formData.entries()) {
        const [name, value] = entry;
        if (value !== 'on') return;
        if (name.startsWith('module-'))
            selectedModules.push(name.replace(/^module-/, ''));
        if (name === 'minify') minify = true;
    }
    const url = new URL(window.location.href);
    url.searchParams.set('modules', filterModules(selectedModules).join(separator));
    url.searchParams.set('minify', minify);
    window.location = url.href;
}

async function handleSubmittedModules(url) {
    const modulesString = url.searchParams.get('modules');
    const minify = url.searchParams.get('minify') === 'true';
    const selectedModules = filterModules(modulesString.split(separator));
    debugLog('Selected modules', selectedModules);
    if (output) output.style.display = null;

    const promises = selectedModules.map((module) => fetch(`/modules/${module}.css`).then((response) => {
        // eslint-disable-next-line no-magic-numbers
        if (!response.status === 200 || !response.ok) throw `Could not fetch module '${module}'`;
        return response.text();
    }));

    Promise.all(promises).then((values) => {
        processCss(values.join('\n'), minify);
    });
}

async function processCss(css, minify) {
    const { minify: cssoMinify } = await import(/* webpackChunkName: "csso" */ 'csso');
    const cssoOptions = { forceMediaMerge: true, comments: 'first-exclamation' };
    let processedCss = cssoMinify(css, cssoOptions).css;

    if (!minify) {
        const { default: { format: prettierFormat } } =
            await import(/* webpackChunkName: "prettier" */ 'prettier/standalone');
        const { default: prettierPluginCss } = await import('prettier/plugins/postcss');
        const prettierOptions = { parser: 'css', plugins: [prettierPluginCss] };
        processedCss = await prettierFormat(processedCss, prettierOptions);
    }
    download(processedCss);
}

function download(css) {
    const link = document.createElement('a');
    link.setAttribute('download', 'c4s-custom-modules.css');
    link.href = `data:text/css,${encodeURIComponent(css)}`;
    link.click();
    if (output) output.innerText = 'Finished generating, your download has started';
}

(() => {
    if (!form) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has('modules')) {
        handleSubmittedModules(url);
    } else {
        form.style.display = null;
        form.addEventListener('submit', handleSubmit);
    }
})();
