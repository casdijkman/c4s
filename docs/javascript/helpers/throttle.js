/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

let throttlePause = false;

export default function throttle(callback, milliseconds = 100, ...argv) {
  if (throttlePause) return;
  throttlePause = true;
  setTimeout(() => {
    callback(...argv);
    throttlePause = false;
  }, milliseconds);
}
