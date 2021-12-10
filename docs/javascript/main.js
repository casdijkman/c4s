/*!
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import './header';

if (/\/example.html$/.test(window.location.pathname)) {
    import('./example-page').then();
}
