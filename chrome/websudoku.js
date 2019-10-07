class Sudoku {
    constructor(cells) {
        this.cells = cells;
        this.candidates = [];
        for (let x = 0; x < 9; x++) {
            this.candidates[x] = [];
            for (let y = 0; y < 9; y++) {
                this.candidates[x][y] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
            }
        }
    }
    getCandidates(row, column) {
        return this.candidates[row][column];
    }
    isLegalRow(row) {
        if (row < 0 || row > 8) {
            console.error("isLegalRow: row out of range: " + row);
            return false;
        }
        for (let n = 1; n <= 9; n++) {
            let c = 0;
            for (let i = 0; i < 9; i++) {
                if (this.cells[row][i] == n) {
                    c++;
                }
            }
            if (c > 1) {
                console.log("isLegalRow " + row + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }
    isLegalColumn(column) {
        if (column < 0 || column > 8) {
            console.error("isLegalColumn: column out of range: " + column);
            return false;
        }
        for (let n = 1; n <= 9; n++) {
            let c = 0;
            for (let i = 0; i < 9; i++) {
                if (this.cells[i][column] == n) {
                    c++;
                }
            }
            if (c > 1) {
                console.log("isLegalColumn: " + column + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }
    isLegalBox(box) {
        if (box < 0 || box > 8) {
            console.error("islegalBox: box out of range: " + box);
            return false;
        }
        for (let n = 1; n <= 9; n++) {
            let c = 0;
            for (let ii = 0; ii < 3; ii++) {
                let i = 3 * (Math.floor(box / 3)) + ii;
                for (let jj = 0; jj < 3; jj++) {
                    let j = (3 * (box % 3)) + jj;
                    if (this.cells[i][j] == n) {
                        c++;
                    }
                }
            }
            if (c > 1) {
                console.log("isLegalBox: " + box + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }
    isRowSolved(row) {
        for (let n = 1; n <= 9; n++) {
            let found = false;
            for (let col = 0; col < 9 && !found; col++) {
                if (this.cells[row][col] == n) {
                    found = true;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    isColumnSolved(col) {
        for (let n = 1; n <= 9; n++) {
            let found = false;
            for (let row = 0; row < 9 && !found; row++) {
                if (this.cells[row][col] == n) {
                    found = true;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    isBoxSolved(box) {
        for (let n = 1; n <= 9; n++) {
            let found = false;
            for (let ii = 0; ii < 3 && !found; ii++) {
                let row = 3 * (Math.floor(box / 3)) + ii;
                for (let jj = 0; jj < 3 && !found; jj++) {
                    let col = (3 * (box % 3)) + jj;
                    if (this.cells[row][col] == n) {
                        found = true;
                    }
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }
    isSolved() {
        for (let i = 0; i < 9; i++) {
            if (!this.isRowSolved(i)) {
                return false;
            }
            if (!this.isColumnSolved(i)) {
                return false;
            }
            if (!this.isBoxSolved(i)) {
                return false;
            }
        }
        return true;
    }
    promoteCandidateToPermanent(row, col) {
        //Remove from candidates and add to cells
        let c = this.candidates[row][col].pop();
        this.cells[row][col] = c;
        console.log("[" + row + "][" + col + "]=" + c);
        //Remove from candidates in the row
        for (let i = 0; i < 9; i++) {
            let position = this.candidates[row][i].indexOf(c);
            if (position != -1) {
                this.candidates[row][i].splice(position, 1);
                if (this.candidates[row][i].length == 1) {
                    this.promoteCandidateToPermanent(row, i);
                }
            }
        }
        //Remove from candidates in the col
        for (let i = 0; i < 9; i++) {
            let position = this.candidates[i][col].indexOf(c);
            if (position != -1) {
                this.candidates[i][col].splice(position, 1);
                if (this.candidates[i][col].length == 1) {
                    this.promoteCandidateToPermanent(i, col);
                }
            }
        }
        //Remove from candidates in the 3x3 box
        for (let ii = 0; ii < 3; ii++) {
            let i = (3 * Math.floor(row / 3)) + ii;
            for (let jj = 0; jj < 3; jj++) {
                let j = (3 * Math.floor(col / 3)) + jj;
                let position = this.candidates[i][j].indexOf(c);
                if (position != -1) {
                    this.candidates[i][j].splice(position, 1);
                    if (this.candidates[i][j].length == 1) {
                        this.promoteCandidateToPermanent(i, j);
                    }
                }
            }
        }
    }
    nonRepeatingCandidatesInRow(row) {
        let changed = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the row. 
        let localCandidates = new Map();
        for (let col = 0; col < 9; col++) {
            for (let i = 0; i < this.candidates[row][col].length; i++) {
                let c = this.candidates[row][col][i];
                if (!localCandidates.has(c)) {
                    localCandidates.set(c, col);
                }
                else {
                    //value has been seen before. set to -1 as a flag that 
                    //the candidate is not unique
                    localCandidates.set(c, -1);
                }
            }
        }
        for (let n = 1; n <= 9; n++) {
            if (localCandidates.has(n) && localCandidates.get(n) >= 0) {
                let col = localCandidates.get(n);
                this.candidates[row][col].length = 0;
                this.candidates[row][col].push(n);
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
    }
    nonRepeatingCandidatesInColumn(col) {
        let changed = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the column. 
        let localCandidates = new Map();
        for (let row = 0; row < 9; row++) {
            for (let i = 0; i < this.candidates[row][col].length; i++) {
                let c = this.candidates[row][col][i];
                if (!localCandidates.has(c)) {
                    localCandidates.set(c, row);
                }
                else {
                    //value has been seen before. set to -1 as a flag that 
                    //the candidate is not unique
                    localCandidates.set(c, -1);
                }
            }
        }
        for (let n = 1; n <= 9; n++) {
            if (localCandidates.has(n) && localCandidates.get(n) >= 0) {
                let row = localCandidates.get(n);
                this.candidates[row][col].length = 0;
                this.candidates[row][col].push(n);
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
    }
    nonRepeatingCandidatesInBox(box) {
        let changed = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the column. 
        let localCandidates = new Map();
        for (let ii = 0; ii < 3; ii++) {
            let row = 3 * (Math.floor(box / 3)) + ii;
            for (let jj = 0; jj < 3; jj++) {
                let col = (3 * (box % 3)) + jj;
                for (let i = 0; i < this.candidates[row][col].length; i++) {
                    let c = this.candidates[row][col][i];
                    if (!localCandidates.has(c)) {
                        localCandidates.set(c, 3 * ii + jj);
                    }
                    else {
                        //value has been seen before. set to -1 as a flag that 
                        //the candidate is not unique
                        localCandidates.set(c, -1);
                    }
                }
            }
        }
        for (let n = 1; n <= 9; n++) {
            if (localCandidates.has(n) && localCandidates.get(n) >= 0) {
                let row = 3 * box + Math.floor(localCandidates.get(n) / 3);
                let col = 3 * box + localCandidates.get(n) % 3;
                this.candidates[row][col].length = 0;
                this.candidates[row][col].push(n);
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
    }
    isLegal() {
        for (let i = 0; i < 9; i++) {
            if (!this.isLegalRow(i)) {
                return false;
            }
            if (!this.isLegalColumn(i)) {
                return false;
            }
            if (!this.isLegalBox(i)) {
                return false;
            }
        }
        return true;
    }
    solve() {
        //This reads the initial configuration of the sudoku and sets the 
        //list of candidates for those cells to a single value, so that I
        //can treat them as any other cell that had just been reduced to a
        //value, without the need of processing these separatedly.
        console.log("Populating initial values");
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.cells[x][y] != 0) {
                    this.candidates[x][y] = [this.cells[x][y]];
                }
            }
        }
        //Knowing that promoteCandidateToPermanent will recursively call itself when
        //it finds a list of candidates reduced to one single value, I'm going through
        //the board calling that function for the initial values.
        console.log("Strategy #1: recursively remove found values from candidate lists of size 1");
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.candidates[x][y].length == 1) {
                    this.promoteCandidateToPermanent(x, y);
                }
            }
        }
        if (this.isSolved())
            return;
        //Once the algorithm reaches this point, the recursive calls to promoteCandidateToPermanent
        //will have taken care of all the values that can be found by simply eliminating known set
        //values from the corresponding rows, columns and boxes. At this point the board is either
        //solved or there are no cells with a single candidate value. They all have 2 or more.
        //This next step finds cells that contain one value on their candidates list that is not present 
        //in any of the candidates lists for the same row, column or box
        console.log("Strategy #2: find values in the row/col/box that only exist in one candidate list from that same row/col/box)");
        let changed = true;
        while (changed) {
            changed = false;
            console.log("Looping again!");
            for (let row = 0; row < 9 && !changed; row++) {
                console.log("checking row " + row);
                changed = this.nonRepeatingCandidatesInRow(row);
            }
            for (let col = 0; col < 9 && !changed; col++) {
                console.log("checking col " + col);
                changed = this.nonRepeatingCandidatesInColumn(col);
            }
            for (let box = 0; box < 9 && !changed; box++) {
                console.log("checking box " + box);
                changed = this.nonRepeatingCandidatesInBox(box);
            }
        }
    }
}
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