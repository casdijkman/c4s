/*!
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import $ from '@casd/dom-surfer';
import './header';
import './scroll-top-button';
import './order-table';
import './reorder-list';
import './custom-modules';
import { setStickyHeight } from './sticky';
import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import { debugLog } from './helpers/constants';
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

$('[data-debug-log]').$each(($e) => {
    const logType = $e.data('debug-log');
    switch (logType) {
        case 'innerText':
            debugLog($e.innerText());
            break;
        default:
            debugLog($e.first());
    }
});

const throttleMs = 300;
document.addEventListener('scroll', () => {
    throttle(() => document.dispatchEvent(new Event('throttled-scroll')), throttleMs);
});

