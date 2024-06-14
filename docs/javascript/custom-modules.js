/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import modules from '../../src/module-list.json';
import {
    debugLog,
    httpSuccessStatus
} from './helpers/constants';

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

function handleFormSubmit(event) {
    event.preventDefault();
    const formData = new FormData(this);
    const selectedModules = [];
    let isMinified = false;

    for (let entry of formData.entries()) {
        const [name, value] = entry;
        if (value !== 'on') return;
        if (name.startsWith('module-'))
            selectedModules.push(name.replace(/^module-/, ''));
        if (name === 'minify') isMinified = true;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('modules', filterModules(selectedModules).join(separator));
    url.searchParams.set('isMinified', isMinified);
    window.location = url.href;
}

async function createCssFromModules({ modulesString, isMinified }) {
    const selectedModules = filterModules(modulesString.split(separator));
    debugLog('Selected modules', selectedModules);
    if (output) output.style.display = null;

    const promises = selectedModules.map((module) => fetch(`/modules/${module}.css`)
        .then((response) => {
            if (!response.status === httpSuccessStatus || !response.ok) {
                throw `Could not fetch module '${module}'`;
            }
            return response.text();
        })
    );

    Promise.all(promises).then(
        (values) => processCss({ css: values.join('\n'), isMinified })
    );
}

async function processCss({ css, isMinified }) {
    const { minify } = await import(/* webpackChunkName: "csso" */ 'csso');
    const cssoOptions = { forceMediaMerge: true, comments: 'first-exclamation' };
    let processedCss = minify(css, cssoOptions).css;

    if (!isMinified) {
        const { default: { format: prettierFormat } } =
            await import(/* webpackChunkName: "prettier" */ 'prettier/standalone');
        const { default: prettierPluginCss } = await import('prettier/plugins/postcss');
        const prettierOptions = { parser: 'css', plugins: [prettierPluginCss] };
        processedCss = await prettierFormat(processedCss, prettierOptions);
    }
    download({ css: processedCss, isMinified });
}

function download({ css, isMinified = false }) {
    const link = document.createElement('a');
    link.setAttribute(
        'download',
        `c4s-custom-modules${isMinified ? '.min' : ''}.css`
    );
    link.href = `data:text/css,${encodeURIComponent(css)}`;
    link.click();
    if (output) output.innerHTML = `
🥳 Finished generating, your download has started<br>
<a href=${location.pathname} class="link dark-blue hover-underline">
<div class="dib">👉&nbsp;</div>Create another custom stylesheet</a><br>
Or share <a href="${location}" class="link dark-blue hover-underline">
this download link</a> with your friends 👐
</a>`;
}

(() => {
    if (!form) return;
    const url = new URL(window.location.href);
    if (url.searchParams.has('modules')) {
        createCssFromModules({
            modulesString: url.searchParams.get('modules'),
            isMinified: url.searchParams.get('isMinified') === 'true'
        });
    } else {
        form.style.display = null;
        form.addEventListener('submit', handleFormSubmit);
    }
})();
