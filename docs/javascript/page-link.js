/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { header, preventOpenHeader } from './header';

function setStickyHeight() {
    const sticky = document.querySelectorAll('.js-sticky');
    let height = 0;

    sticky.forEach((element) => {
        if (!element.dataset.hidden) {
            height += element.getBoundingClientRect().height;
        }
    });

    document.documentElement.style.setProperty('--sticky-height', `${Math.ceil(height)}px`);
}

function openExample(hash, scrollIntoView = false) {
    const target = document.querySelector(hash);
    if (!target) return;
    const details = target.parentElement.querySelector('details');
    if (details) details.open = true;
    const link = document.querySelector(`[href="${hash}"]`);
    if (link && link.parentElement.classList.contains('js-sticky')) {
        const cssClass = 'debug-striped';
        link.parentElement.childNodes.forEach((element) => {
            element.classList.remove(cssClass);
        });
        link.classList.add(cssClass);
        if (scrollIntoView) link.scrollIntoView();
    }
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const scrollToHash = event.target.attributes.href.value;
        const scrollTo = document.querySelector(scrollToHash);
        if (!scrollTo) return;
        event.preventDefault();

        if (header) {
            preventOpenHeader();
        }

        setStickyHeight();
        window.location.hash = scrollToHash;
        openExample(scrollToHash);
        scrollTo.scrollIntoView();
    });
});

setStickyHeight();

if (window.location.hash) openExample(window.location.hash, true);
