/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { matchMediaUp } from './helpers/breakpoints';

const scrollTopButton = document.querySelector('.js-scroll-top');

const handleScroll = () => {
    const minScrollTop = Math.max(document.documentElement.clientHeight, 1000);
    const show = document.documentElement.scrollTop > minScrollTop && matchMediaUp('m');
    scrollTopButton.style.display = show ? 'block' : 'none';
};

if (scrollTopButton) document.addEventListener('throttled-scroll', handleScroll);
