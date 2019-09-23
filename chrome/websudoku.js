var Sudoku = /** @class */ (function () {
    function Sudoku(cells) {
        this.cells = cells;
        this.candidates = [];
        for (var x = 0; x < 9; x++) {
            this.candidates[x] = [];
            for (var y = 0; y < 9; y++) {
                this.candidates[x][y] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
    }
    Sudoku.prototype.promoteCandidateToPermanent = function (x, y) {
        //Remove from candidates and add to cells
        var c = this.candidates[x][y].pop();
        this.cells[x][y] = c;
        //Remove from candidates in the row
        for (var i = 0; i < 9; i++) {
            var position = this.candidates[x][i].indexOf(c);
            if (position != -1) {
                this.candidates[x][i].splice(position, 1);
                if (this.candidates[x][i].length == 1) {
                    this.promoteCandidateToPermanent(x, i);
                }
            }
        }
        //Remove from candidates in the col
        for (var i = 0; i < 9; i++) {
            var position = this.candidates[i][y].indexOf(c);
            if (position != -1) {
                this.candidates[i][y].splice(position, 1);
                if (this.candidates[i][y].length == 1) {
                    this.promoteCandidateToPermanent(i, y);
                }
            }
        }
        //Remove from candidates in the 3x3 square
        for (var ii = 0; ii < 3; ii++) {
            var i = (3 * Math.floor(x / 3)) + ii;
            for (var jj = 0; jj < 3; jj++) {
                var j = (3 * Math.floor(y / 3)) + jj;
                var position = this.candidates[i][j].indexOf(c);
                if (position != -1) {
                    this.candidates[i][j].splice(position, 1);
                    if (this.candidates[i][j].length == 1) {
                        this.promoteCandidateToPermanent(i, j);
                    }
                }
            }
        }
    };
    Sudoku.prototype.solve = function () {
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                if (this.cells[x][y] != 0) {
                    this.candidates[x][y] = [this.cells[x][y]];
                }
            }
        }
        for (var x = 0; x < 9; x++) {
            for (var y = 0; y < 9; y++) {
                if (this.candidates[x][y].length == 1) {
                    this.promoteCandidateToPermanent(x, y);
                }
            }
        }
    };
    return Sudoku;
}());
/*
let testCells = [[0,5,1,0,0,0,9,0,7],
                      [0,9,2,0,0,5,0,0,8],
                      [0,0,7,0,1,8,0,5,0],
                      [0,1,0,8,9,0,0,3,0],
                      [9,0,0,0,4,0,0,0,6],
                      [0,2,0,0,5,7,0,8,0],
                      [0,4,0,7,2,0,8,0,0],
                      [2,0,0,4,0,0,6,7,0],
                      [1,0,8,0,0,0,3,2,0]];

let s = new Sudoku(testCells);
console.log(s.cells);
s.solve();
console.log("--------------------------");
console.log(s.cells);
*/ 
//# sourceMappingURL=websudoku.js.map