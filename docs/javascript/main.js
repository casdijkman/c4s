/*!
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import './header';
import { setStickyHeight } from './sticky';
import { breakpoints, matchMediaUp } from './helpers/breakpoints';

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
