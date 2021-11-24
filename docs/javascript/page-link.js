/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { header, onScroll, hideHeader } from './header';

function setStickyHeight() {
    const sticky = document.querySelectorAll('.js-sticky');
    let height = 0;
    sticky.forEach((element) => {
        height += element.getBoundingClientRect().height;
    })
    document.documentElement.style.setProperty('--sticky-height', `${height}px`);
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
        const scrollTo = document.querySelector(event.target.attributes.href.value);
        if (!scrollTo) return;
        event.preventDefault();
        if (header) {
            onScroll();
            hideHeader();
        }
        setStickyHeight();
        scrollTo.scrollIntoView();
    })
});
