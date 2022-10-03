/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export const debug = new URLSearchParams(window.location.search).has('debug');
export const debugLog = (...args) => {
    // eslint-disable-next-line no-console
    if (debug) console.log(...args);
};
