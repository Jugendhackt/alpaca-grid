const NUMBER_CELLS = 500;

/*
* Colors
* - 0: white
* - 1: color head
* - 2: color face
*/
const ALPACA_MAP = [
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [1, 1, 1, 1, 0, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 0, 0, 0, 1, 1],
    [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    [1, 0, 2, 0, 0, 0, 0, 0, 2, 0, 1],
    [1, 0, 0, 0, 2, 0, 2, 0, 0, 0, 1],
    [1, 1, 0, 0, 2, 2, 2, 0, 0, 1, 1],
    [0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0],
    [0, 0, 1, 1, 1, 1, 1, 1, 1, 0, 0],
];

class Alpaca {
    constructor(row, column) {
        this.row = row;
        this.column = column;

        for (const [row_index, row_value] of ALPACA_MAP.entries()) {
            for (const [column_index, column_value] of row_value.entries()) {
                let color_class = "";
                let color_row = row_index + this.row;
                let color_column = column_index + this.column;

                if (column_value === 1) {
                    color_class = "alpaca-color-head";
                } else if (column_value === 2) {
                    color_class = "alpaca-color-face";
                }

                let query_string = `[data-row="${color_row}"][data-column="${color_column}"]`;
                let cell = document.querySelector(query_string);

                if (color_class !== "") {
                    cell.classList.add(color_class);
                }
            }
        }
    }
}

function remove_class_from_elements(elements, class_name) {
    for (let element of elements) {
        element.classList.remove(class_name);
    }
}

class Tracker {
    constructor() {
        this.count = 0;

        setInterval(() => this.move_tracker(), 100);
    }

    move_tracker() {
        let cells = document.getElementsByClassName("cell");
        remove_class_from_elements(cells, 'active');
        let cell = document.querySelector(
            `[data-index="${this.count}"]`);
        cell.classList.add('active');

        this.count++;

        if (this.count === cells.length) {
            this.count = 0;
        }
    }
}

function generate_new_grid() {
    let grid = document.getElementById("grid");
    let body_margin = 10 * 2;
    // Compute number of rows and columns, and cell size
    var x = window.innerWidth - body_margin;
    var y = window.innerHeight - body_margin;

    var ratio = x / y;
    var ncols_float = Math.sqrt(NUMBER_CELLS * ratio);
    var nrows_float = NUMBER_CELLS / ncols_float;

    // Find best option filling the whole height
    var nrows1 = Math.ceil(nrows_float);
    var ncols1 = Math.ceil(NUMBER_CELLS / nrows1);
    while (nrows1 * ratio < ncols1) {
        nrows1++;
        ncols1 = Math.ceil(NUMBER_CELLS / nrows1);
    }
    var cell_size1 = y / nrows1;

    // Find best option filling the whole width
    var ncols2 = Math.ceil(ncols_float);
    var nrows2 = Math.ceil(NUMBER_CELLS / ncols2);
    while (ncols2 < nrows2 * ratio) {
        ncols2++;
        nrows2 = Math.ceil(NUMBER_CELLS / ncols2);
    }
    var cell_size2 = x / ncols2;

    // Find the best values
    var nrows, ncols, cell_size;
    if (cell_size1 < cell_size2) {
        nrows = nrows2;
        ncols = ncols2;
        cell_size = cell_size2;
    } else {
        nrows = nrows1;
        ncols = ncols1;
        cell_size = cell_size1;
    }

    grid.innerHTML = "";
    let row = -1;

    for (var i = 0; i < (ncols * nrows); i++) {
        let column = i % ncols;
        if (i % ncols === 0) {
            row += 1;
        }

        grid.insertAdjacentHTML('beforeend',
            `<div class="cell"
                  data-row="${column}"
                  data-column="${row}"
                  data-index="${i}">
                ${column}/${row}
            </div>`
        );
    }

    let cells = document.getElementsByClassName("cell");

    for (let cell of cells) {
        cell.style.height = `${cell_size}px`;
        cell.style.lineHeight = `${cell_size}px`;
    }

    grid.style.gridTemplateColumns =
        `repeat(auto-fill, ${cell_size}px`;

    new Alpaca(5, 5);
}

window.onresize = generate_new_grid;
generate_new_grid();
let tracker = new Tracker();
