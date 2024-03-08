/*
 * SPDX-FileCopyrightText: 2024 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const formElement = document.querySelector('#font-size-form');
const input = formElement.querySelector('.js-input');
const showValue = formElement.querySelector('.js-value');
const reset = formElement.querySelector('button[type="reset"]');
const showSizesElement = document.querySelector('.show-font-sizes');
const originalFontSize = getComputedStyle(document.documentElement).fontSize;

function showSizes() {
    Array.from(showSizesElement.children).forEach((element) => {
        const fontSize = getComputedStyle(element).fontSize;
        element.innerText = `${element.dataset.text} @${fontSize}`;
    });
}

function setSize(event) {
    const target = event.currentTarget || event.target;
    const fontSize = target.value ? `${target.value}px` : originalFontSize;
    showSizesElement.style.fontSize = fontSize;
    showValue.innerText = fontSize;
    showSizes();
}

function initialize() {
    input.value = originalFontSize.replace('px', '');
    showValue.innerText = originalFontSize;
    input.addEventListener('input', setSize);
    reset.addEventListener('click', setSize);
    showSizes();
}

if (formElement) initialize();
