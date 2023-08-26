/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

export const breakpoints = {
    // base is anything smaller than s
    s: '30em',
    m: '40em',
    l: '60em',
    h: '90em'
};

const breakpointKeys = Object.keys(breakpoints);

function matchMedia(mediaName, direction) {
    const breakpoint = breakpoints[mediaName];
    const upperBreakpointIndex = breakpointKeys.indexOf(mediaName) + 1;
    const upperBreakpoint = Object.values(breakpoints)[upperBreakpointIndex];
    if (typeof breakpoint === 'undefined') throw new Error('Breakpoint not found');

    switch (direction) {
        case 'down': return window.matchMedia(`(max-width: ${breakpoint})`);
        case 'up': return window.matchMedia(`(min-width: ${breakpoint})`);
        case 'only':
            if (typeof upperBreakpoint === 'undefined') {
                return matchMedia(mediaName, 'up');
            } else {
                return window.matchMedia(
                    `(min-width: ${breakpoint}) and (max-width: ${upperBreakpoint})`
                );
            }
        default: throw new Error('Unknown breakpoint direction');
    }
}

export function matchMediaDown(mediaName) {
    try {
        return matchMedia(mediaName, 'down');
    } catch (e) {
        console.error(e);
    }
}

export function matchMediaUp(mediaName) {
    try {
        return matchMedia(mediaName, 'up');
    } catch (e) {
        console.error(e);
    }
}

export function matchMediaOnly(mediaName) {
    try {
        return matchMedia(mediaName, 'only');
    } catch (e) {
        console.error(e);
    }
}

export function isMediaDown(mediaName) {
    try {
        return matchMediaDown(mediaName).matches;
    } catch (e) {
        console.error(e);
    }
}

export function isMediaUp(mediaName) {
    try {
        return matchMediaUp(mediaName).matches;
    } catch (e) {
        console.error(e);
    }
}

export function isMediaOnly(mediaName) {
    try {
        return matchMediaOnly(mediaName).matches;
    } catch (e) {
        console.error(e);
    }
}

export function getMediaName() {
    breakpointKeys.forEach((breakpoint) => {
        if (typeof breakpoint === 'string' && isMediaOnly(breakpoint)) {
            return breakpoint;
        }
    });
    return 'base'; // Return default (base) when no breakpoint matches
}
