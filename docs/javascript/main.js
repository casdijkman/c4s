/*!
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import $ from './helpers/dom-surfer';
import './header';
import './scroll-top-button';
import './order-table';
import './reorder-list';
import './custom-modules';
import { setStickyHeight } from './sticky';
import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import throttle from './helpers/throttle';

window.$ = $;

setStickyHeight();
for (const breakpoint in breakpoints) {
    matchMediaUp(breakpoint).addListener(setStickyHeight);
}

if (/\/example.html$/.test(window.location.pathname)) {
    import(/* webpackChunkName: "example-page" */ './example-page').then();
}

if (/.*test.html$/.test(window.location.pathname)) {
    import(/* webpackChunkName: "test-page" */ './test-page').then();
}

const throttleMs = 300;
document.addEventListener('scroll', () => {
    throttle(() => document.dispatchEvent(new Event('throttled-scroll')), throttleMs);
});
