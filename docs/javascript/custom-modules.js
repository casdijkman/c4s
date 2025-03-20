/*
 * SPDX-FileCopyrightText: 2025 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import $ from '@casd/dom-surfer';
import modules from '../../src/module-list.json';
import {
    debugLog,
    httpSuccessStatus
} from './helpers/constants';

const $form = $('[data-custom-modules-form]');
const output = document.querySelector('[data-custom-modules-output]');
const $outputCss = $('[data-custom-modules-output-css]');
const separator = '|';

const filterModules = (filterArray) => {
    const responsiveSuffix = '-responsive';

    return filterArray
        .filter((moduleName) => moduleName !== '')
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

    if (selectedModules.length === 0) {
        alert('No modules selected'); // eslint-disable-line no-alert
        location.href = location.pathname;
        return;
    }
    debugLog('Selected modules', selectedModules);

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
        const {
            default: { format: prettierFormat }
        } = await import(/* webpackChunkName: "prettier" */ 'prettier/standalone');
        const { default: prettierPluginCss } = await import('prettier/plugins/postcss');
        const prettierOptions = { parser: 'css', plugins: [prettierPluginCss] };
        processedCss = await prettierFormat(processedCss, prettierOptions);
    }
    download({ css: processedCss, isMinified });
}

function download({ css, isMinified = false }) {
    const link = document.createElement('a');
    const fileName = `c4s-custom-modules${isMinified ? '.min' : ''}.css`;
    link.setAttribute('download', fileName);
    link.href = `data:text/css,${encodeURIComponent(css)}`;
    link.click();

    if (output) {
        output.style.display = null;
        output.innerHTML = `
🥳 Finished generating, your download has started<br>
<a href=${location.pathname} class="link dark-blue hover-underline">
<div class="dib">👉&nbsp;</div>Create another custom stylesheet</a><br>
Or share <a href="${location}" class="link dark-blue hover-underline">
this download link</a> with your friends 👐
</a>`;
    }

    if ($outputCss.any()) {
        $outputCss.show();
        $outputCss.innerHtml(css);
    }
}

function initializeForm() {
    $form.show();
    $form.onSubmit(handleFormSubmit);
    $('[data-action="disable-modules"]').onClick(() => {
        $form.find('[data-checkbox-module]').each((element) => {
            element.checked = false;
        });
    });
    $('[data-action="disable-responsive"]').onClick(() => {
        $form.find('[data-checkbox-responsive]').each((element) => {
            element.checked = false;
        });
    });
    $('[data-action="enable-modules"]').onClick(() => {
        $form.find('[data-checkbox-module]').each((element) => {
            element.checked = true;
        });
    });
    $('[data-action="enable-responsive"]').onClick(() => {
        $form.find('[data-checkbox-responsive]').each((element) => {
            element.checked = true;
        });
    });
}

(() => {
    if ($form.none()) return;
    const url = new URL(window.location.href);

    if (url.searchParams.has('modules')) {
        createCssFromModules({
            modulesString: url.searchParams.get('modules'),
            isMinified: url.searchParams.get('isMinified') === 'true'
        });
    } else {
        initializeForm();
    }
})();
