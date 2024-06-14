/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export const isDebug = new URLSearchParams(window.location.search).has('debug');
export const debugLog = (...args) => {
    // eslint-disable-next-line no-console
    if (isDebug) console.log(...args);
};
export const httpSuccessStatus = 200;
