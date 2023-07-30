/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { header, preventOpenHeader } from './header';
import { setStickyHeight } from './sticky';
import { debug, debugLog } from './helpers/constants';

const closeExamplesButton = document.querySelector('.js-close-examples');
console.assert(closeExamplesButton, 'Could not find close examples button');

function openExample(data) {
    if (data.details) data.details.open = true;
    if (data.target) data.target.scrollIntoView();
    updateCloseExamplesButton();
}

function updateLinks(data = {}, setActive = true) {
    const { link } = data;
    const links = document.querySelector('.js-example-links');
    const cssClass = 'debug-striped';
    links.childNodes.forEach((element) => {
        element.classList.remove(cssClass);
    });
    if (!link || !setActive) return;
    link.classList.add(cssClass);

    // Scroll link into view
    const bcr = link.getBoundingClientRect();
    if (bcr.left < 0) {
        const scrollToX = links.scrollLeft + bcr.left;
        links.scrollTo(scrollToX, null);
    } else if (bcr.right > links.clientWidth) {
        const scrollToX = links.scrollLeft + bcr.right - links.clientWidth;
        links.scrollTo(scrollToX, null);
    }
}

function updateHash(hash) {
    window.location.hash = hash.replace(/^#/, '');
}

function getDataFromHash(hash) {
    const target = document.querySelector(hash);
    const details = target ? target.parentElement.querySelector('details') : null;
    const link = document.querySelector(`[href="${hash}"]`);
    return { hash, target, details, link };
}

function debugExamples() {
    const excludedModules = ['reset'];
    const examplesNotFound = document.querySelectorAll('[data-example-not-found]');
    if (examplesNotFound) {
        debugLog(examplesNotFound.length, 'examples not found');
        examplesNotFound.forEach((example) => {
            const moduleName = example.dataset.exampleNotFound;
            if (excludedModules.includes(moduleName)) return;
            debugLog('Not found:', moduleName);
        });
    }

    const examplesEmpty = document.querySelectorAll('.js-example:empty');
    examplesEmpty?.forEach((example) => {
        const isExcluded = excludedModules.some(
            (module) => document.querySelector(`#${module}`)
                .parentNode.querySelector('details')?.contains(example)
        );
        if (! isExcluded) debugLog(example);
    });
}

function updateCloseExamplesButton() {
    setTimeout(() => {
        const anyOpenDetails = document.querySelectorAll('details[open]').length > 0;
        closeExamplesButton.style.visibility = anyOpenDetails ? 'visible' : 'hidden';
    }, 0);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const hash = event.target.attributes.href.value;
        const data = getDataFromHash(hash);
        event.preventDefault();

        if (header) preventOpenHeader();
        setStickyHeight();
        updateLinks(data);
        openExample(data);
        updateHash(data.hash);
    });
});

document.querySelectorAll('summary').forEach((summary) => {
    summary.addEventListener('click', (e) => {
        const data = getDataFromHash(`#${e.currentTarget.dataset.module}`);
        const opening = !data.details.open;
        updateLinks(data, opening);
        if (opening) updateHash(data.hash);
        updateCloseExamplesButton();
    });
});

closeExamplesButton.addEventListener('click', () => {
    document.querySelectorAll('details').forEach((x) => { x.open = false; });
    updateCloseExamplesButton();
    updateLinks();
});

function initialize() {
    if (window.location.hash) {
        const data = getDataFromHash(window.location.hash);
        updateLinks(data);
        openExample(data);
    }

    if (debug) debugExamples();
}

initialize();
