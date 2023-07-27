/*!
 * SPDX-FileCopyrightText: 2021 Cas Dijkman
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

const tableClass = 'js-order-table';
const tableHeadsFromElement = (element) => Array.from(element.querySelectorAll(`.${tableClass} tr:first-child th`));
const sortOrders = ['ascending', 'descending'];

const sortFunctions = {
    string: function (a, b) {
        return this.getValue(a).localeCompare(this.getValue(b));
    },
    number: function (a, b) {
        return Number(this.getValue(a)) - Number(this.getValue(b));
    },
    reset: function (a, b) {
        return Number(a.dataset.originalOrder) - Number(b.dataset.originalOrder);
    }
};

const sortRows = (rows, name, order, columnNumber) => {
    if (!Object.prototype.hasOwnProperty.call(sortFunctions, name)) return rows;

    const sortedRows = rows.sort( sortFunctions[name].bind({
        getValue: (row) => {
            const element = row.querySelector(`:nth-child(${columnNumber})`);
            return element.dataset.value || element.innerText;
        }
    }));
    if (order === sortOrders[1]) sortedRows.reverse();
    return sortedRows;
};

function handleSortTableHead() {
    const table = this.closest(`.${tableClass}`);
    const name = this.dataset.sortName || Object.keys(sortFunctions)[0];
    if (name === 'none') return;

    const order = this.dataset.sortedBy && this.dataset.sortedOrder === sortOrders[0]
          ? sortOrders[1]
          : sortOrders[0];
    const rows = Array.from(table.querySelectorAll('tr:nth-child(n+2)'));
    const columnNumber = Array.from(this.parentElement.children).indexOf(this) + 1;

    sortRows(rows, name, order, columnNumber).forEach((row) => table.appendChild(row));

    tableHeadsFromElement(table).forEach((th) => {
        delete th.dataset.sortedBy;
        delete th.dataset.sortedOrder;
    });
    this.dataset.sortedBy = true;
    this.dataset.sortedOrder = order;
}

tableHeadsFromElement(document).forEach(
    (tableHead) => tableHead.addEventListener('click', handleSortTableHead)
);
