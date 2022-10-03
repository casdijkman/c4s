/*!
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import './header';
import './scroll-top-button';
import { setStickyHeight } from './sticky';
import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import throttle from './helpers/throttle';

setStickyHeight();
for (const breakpoint in breakpoints) {
    matchMediaUp(breakpoint).addListener(setStickyHeight);
}

if (/\/example.html$/.test(window.location.pathname)) {
    import('./example-page').then();
}

if (/.*test.html$/.test(window.location.pathname)) {
    import('./test-page').then();
}

const throttleMs = 300;
document.addEventListener('scroll', () => {
    throttle(() => document.dispatchEvent(new Event('throttled-scroll')), throttleMs);
});
