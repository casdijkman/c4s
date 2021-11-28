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
        scrollTo.scrollIntoView();
        window.location.hash = scrollToHash;
    });
});

setStickyHeight();
