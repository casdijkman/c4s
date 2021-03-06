// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

/* eslint-disable no-console */

import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import throttle from './helpers/throttle';
import { debug } from './helpers/constants';

export const header = document.querySelector('.js-header');
const headerHideClass = 'translateY-n100';

function setHeaderHeight() {
    const height = isHeaderHidden() ? '0px' : `${header.clientHeight}px`;
    document.documentElement.style.setProperty('--header-height', height);
}

let previousScrollY = window.scrollY;
let directionalScrollMemo = previousScrollY;
let scrollingUp = false;
let preventOpen = false;
let preventOpenTimeout;
const thresholdBuffer = 30;
const threshold = (header?.clientHeight || 0) + thresholdBuffer;

function onScroll(dummy = false) {
    const newScrollY = window.scrollY;
    const newScrollingUp = newScrollY < previousScrollY;
    const forceShow = newScrollY < header.clientHeight;

    if (scrollingUp !== newScrollingUp || dummy) {
        if (debug) console.log('old directionalScrollMemo', directionalScrollMemo);
        directionalScrollMemo = newScrollY;
        if (debug) console.log('new directionalScrollMemo', directionalScrollMemo);
    }

    const difference = Math.abs(directionalScrollMemo - newScrollY);
    const shouldShow = difference > threshold && newScrollingUp;

    if (debug) {
        // eslint-disable-next-line max-len
        console.log({ previousScrollY, directionalScrollMemo, newScrollY, difference, threshold, shouldShow });
        console.log({ scrollingUp, newScrollingUp, dummy });
    }

    if (!dummy && (forceShow || shouldShow)) {
        showHeader();
    } else {
        hideHeader();
    }

    previousScrollY = newScrollY;
    scrollingUp = newScrollingUp;
    if (debug) console.log();
}

export function preventOpenHeader() {
    const milliseconds = 400;
    preventOpen = true;
    clearTimeout(preventOpenTimeout);
    preventOpenTimeout = setTimeout(() => {
        preventOpen = false;
    }, milliseconds);
    hideHeader();
}

function isHeaderHidden() {
    return header.classList.contains(headerHideClass);
}

export function hideHeader() {
    const maxViewPortHeight = 1000;
    if (document.documentElement.clientHeight < maxViewPortHeight) {
        header.classList.add(headerHideClass);
        header.dataset.hidden = true;
        setHeaderHeight();
    }
}

function showHeader() {
    header.classList.remove(headerHideClass);
    delete header.dataset.hidden;
    setHeaderHeight();
}

if (header) {
    for (const breakpoint in breakpoints) {
        matchMediaUp(breakpoint).addListener(setHeaderHeight);
    }

    setHeaderHeight();
    const throttleMs = 300;
    document.addEventListener('scroll', () => {
        throttle(onScroll, throttleMs, preventOpen);
    });
}
