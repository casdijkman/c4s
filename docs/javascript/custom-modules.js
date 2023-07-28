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
    return filterArray.filter((module) => {
        if (!modules.includes(module)) {
            console.error('Could not find module', module);
            return false;
        }
        return true;
    });
};

function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData(this);
    const selectedModules = new Array();
    for (let entry of formData.entries()) {
        const [name, value] = entry;
        if (value === 'on') selectedModules.push(name);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('modules', filterModules(selectedModules).join(separator));
    window.location = url.href;
}

function handleSubmittedModules(modulesString) {
    const selectedModules = filterModules(modulesString.split(separator));
    debugLog('Selected modules', selectedModules);
    output.style.display = null;

    const promises = selectedModules.map((module) => fetch(`/modules/${module}.css`).then((response) => {
        // eslint-disable-next-line no-magic-numbers
        if (!response.status === 200 || !response.ok) throw `Could not fetch module '${module}'`;
        return response.text();
    }));

    Promise.all(promises).then((values) => download(values.join('\n')));
}

function download(css) {
    const link = document.createElement('a');
    link.setAttribute('download', 'c4s-custom-modules.css');
    link.href = `data:text/css,${encodeURIComponent(css)}`;
    link.click();
}

(() => {
    if (!form) return;
    const modulesString = new URL(window.location.href).searchParams.get('modules');
    if (modulesString) return handleSubmittedModules(modulesString);
    form.style.display = null;
    form.addEventListener('submit', handleSubmit);
})();
