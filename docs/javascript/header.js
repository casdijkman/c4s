/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

/* eslint-disable no-console */

import { breakpoints, matchMediaUp } from './helpers/breakpoints';
import { debug } from './helpers/constants';
import { setStickyHeight } from './sticky';

export const header = document.querySelector('.js-header');
const headerHideClass = 'translateY-n100';

export const getHeaderHeight = () => isHeaderHidden() ? 0 : header.clientHeight;
const setHeaderHeight = () =>
  document.documentElement.style.setProperty('--header-height', `${getHeaderHeight()}px`);

let previousScrollY = window.scrollY;
let directionalScrollMemo = previousScrollY;
let scrollingUp = false;
let preventOpen = false;
let preventOpenTimeout;
const thresholdBuffer = 30;
const threshold = (header?.clientHeight || 0) + thresholdBuffer;

function handleScroll(dummy = false) {
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
  if (document.documentElement.clientHeight > maxViewPortHeight) return;
  header.classList.add(headerHideClass);
  header.dataset.hidden = true;
  setHeaderHeight();
  setStickyHeight();
}

function showHeader() {
  header.classList.remove(headerHideClass);
  delete header.dataset.hidden;
  setHeaderHeight();
  setStickyHeight();
}

function initialize() {
  if (!header) return;

  for (const breakpoint in breakpoints) {
    matchMediaUp(breakpoint).addListener(setHeaderHeight);
  }

  setHeaderHeight();
  document.addEventListener('throttled-scroll', () => handleScroll(preventOpen));
}

initialize();
