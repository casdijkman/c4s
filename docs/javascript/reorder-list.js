/*
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const listClass = 'js-reorder-list';
const lists = Array.from(document.querySelectorAll(`.${listClass}`));

const intent = {
    before: { dataset: 'before', insert: 'beforebegin' },
    after: { dataset: 'after', insert: 'afterend' }
};

class List {
    constructor(list) {
        this.items = Array.from(list.querySelectorAll('[draggable=true]'));
        list.addEventListener('drop', (e) => e.preventDefault());
        list.addEventListener('dragover', this.handleDragOver.bind(this));

        this.items.forEach((item) => {
            item.addEventListener('dragend', this.handleDragEnd.bind(this));
        });
    }

    handleDragOver(e) {
        if (this.items.indexOf(e.target) === -1) return;
        this.target = e.target;
        const bcr = this.target.getBoundingClientRect();
        // eslint-disable-next-line no-magic-numbers
        const targetMiddle = (bcr.bottom - bcr.top) / 2 + bcr.top;
        this.intent = e.clientY < targetMiddle ? intent.before : intent.after;
        this.resetCursor();
        this.target.dataset.cursor = this.intent.dataset;
    }

    handleDragEnd(e) {
        if (this.target && this.intent) {
            this.target.insertAdjacentElement(this.intent.insert, e.target);
        }
        this.resetCursor();
        delete this.target;
        delete this.intent;
    }

    resetCursor() {
        this.items.forEach((item) => delete item.dataset.cursor);
    }
}

lists.forEach((list) => new List(list));
