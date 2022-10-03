/*!
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const scrollTopButton = document.querySelector('.js-scroll-top');

const onScroll = () => {
    const minScrollTop = Math.max(document.documentElement.clientHeight, 1000);
    const showButton = document.documentElement.scrollTop > minScrollTop;
    scrollTopButton.style.display = showButton ? 'block' : 'none';
};

if (scrollTopButton) document.addEventListener('throttled-scroll', onScroll);
