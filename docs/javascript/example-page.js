/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import $ from '@casd/dom-surfer';
import { getHeaderHeight, header, preventOpenHeader } from './header';
import { setStickyHeight } from './sticky';
import { isDebug, debugLog } from './helpers/constants';

const exampleExcludedModules = [
    'reset',
    'spanning-breakpoints'
];

const closeExamplesButton = document.querySelector('.js-close-examples');
console.assert(closeExamplesButton, 'Could not find close examples button');

function openExample(data) {
    if (data.details) data.details.open = true;
    if (data.target) data.target.scrollIntoView();
    updateCloseExamplesButton();
}

function showLinkInList(link, list) {
    const bcr = link.getBoundingClientRect();
    if (list.scrollWidth > list.clientWidth) {
        if (bcr.left < 0) {
            const scrollToX = list.scrollLeft + bcr.left;
            list.scrollTo(scrollToX, null);
        } else if (bcr.right > list.clientWidth) {
            const scrollToX = list.scrollLeft + bcr.right - list.clientWidth;
            list.scrollTo(scrollToX, null);
        }
    } else if (list.scrollHeight > list.clientHeight) {
        if (bcr.top < getHeaderHeight()) {
            const scrollToY = list.scrollTop + bcr.top - getHeaderHeight();
            list.scrollTo(null, scrollToY);
        } else if (bcr.bottom > list.clientHeight) {
            const scrollToY = list.scrollTop + bcr.bottom - list.clientHeight;
            list.scrollTo(null, scrollToY);
        }
    }
}

function updateLinkLists(data = {}, setActive = true) {
    const { linksTo } = data;
    const $linksTo = $(linksTo);
    const cssClass = 'debug-striped';
    const $linkLists = $('.js-example-links');

    $linkLists.$each(($linkList) => $linkList.$children().removeClass(cssClass));
    if ($linksTo.none() || !setActive) return;

    $linksTo.addClass(cssClass);
    $linkLists.each((linkList) => {
        const link = $linksTo.elements.find((element) => linkList.contains(element));
        if (link) showLinkInList(link, linkList);
    });
}

function updateHash(hash) {
    window.location.hash = hash.replace(/^#/, '');
}

function getDataFromHash(hash) {
    const target = document.querySelector(hash);
    const details = target ? target.parentElement.querySelector('details') : null;
    const linksTo = document.querySelectorAll(`[href="${hash}"]`);
    return { hash, target, details, linksTo };
}

function debugExamples() {
    const examplesNotFound = document.querySelectorAll('[data-example-not-found]');
    if (examplesNotFound) {
        debugLog(examplesNotFound.length, 'examples not found');
        examplesNotFound.forEach((example) => {
            const moduleName = example.dataset.exampleNotFound;
            if (exampleExcludedModules.includes(moduleName)) return;
            debugLog('Not found:', moduleName, { example });
        });
    }

    const examplesEmpty = document.querySelectorAll('.js-example:empty');
    examplesEmpty?.forEach((example) => {
        const isExcluded = exampleExcludedModules.some((module) =>
            document
                .querySelector(`#${module}`)
                .parentNode.querySelector('details')?.contains(example)
        );
        if (!isExcluded) debugLog(example);
    });
}

function updateCloseExamplesButton() {
    setTimeout(() => {
        const visibility = $('details[open]').any() ? 'visible' : 'hidden';
        closeExamplesButton.style.visibility = visibility;
    }, 0);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', function (event) {
        const hash = $(this).attr('href');
        const data = getDataFromHash(hash);
        event.preventDefault();

        if (header) preventOpenHeader();
        setStickyHeight();
        updateLinkLists(data);
        openExample(data);
        updateHash(data.hash);
    });
});

document.querySelectorAll('summary').forEach((summary) => {
    summary.addEventListener('click', (e) => {
        const data = getDataFromHash(`#${e.currentTarget.dataset.module}`);
        const opening = !data.details.open;
        updateLinkLists(data, opening);
        if (opening) updateHash(data.hash);
        updateCloseExamplesButton();
    });
});

closeExamplesButton.addEventListener('click', () => {
    document.querySelectorAll('details').forEach((x) => { x.open = false; });
    updateCloseExamplesButton();
    updateLinkLists();
});

function initialize() {
    if (window.location.hash) {
        const data = getDataFromHash(window.location.hash);
        updateLinkLists(data);
        openExample(data);
    }

    if (isDebug) debugExamples();
}

initialize();
