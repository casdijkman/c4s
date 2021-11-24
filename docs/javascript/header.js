// SPDX-FileCopyrightText: 2021 Cas Dijkman
//
// SPDX-License-Identifier: GPL-3.0-only

import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import throttle from './helpers/throttle';

export const header = document.querySelector('.js-header');
const headerHideClass = 'translateY-n100';

function setHeaderHeight() {
    const height = isHeaderHidden() ? '0px' : `${header.clientHeight}px`;
    document.documentElement.style.setProperty('--header-height', height);
}

let previousScrollY = window.scrollY;
let directionalScrollMemo = window.scrollY;
let scrollingUp = false;
const hideHeaderThreshold = header.clientHeight;

export function onScroll() {
    const newScrollY = window.scrollY;
    const newScrollingUp = newScrollY < previousScrollY;
    const newScrollMemo = scrollingUp === newScrollingUp ? null : newScrollY;

    const diff = directionalScrollMemo - newScrollY;
    // console.log({previousScrollY, directionalScrollMemo, scrollingUp, newScrollMemo, newScrollY, newScrollingUp, diff});
    newScrollY > 0 && diff < hideHeaderThreshold ? hideHeader() : showHeader();

    if (newScrollMemo !== null) directionalScrollMemo = newScrollMemo;
    previousScrollY = newScrollY;
    scrollingUp = newScrollingUp;
}

function isHeaderHidden() {
    return header.classList.contains(headerHideClass);
}

export function hideHeader() {
    header.classList.add(headerHideClass);
    setHeaderHeight();
}

function showHeader() {
    header.classList.remove(headerHideClass);
    setHeaderHeight();
}

if (header) {
    for (const breakpoint in breakpoints) {
        matchMediaUp(breakpoint).addListener(setHeaderHeight);
    }

    setHeaderHeight();
    const throttleMs = 200;
    document.addEventListener('scroll', () => { throttle(onScroll, throttleMs); });
}
