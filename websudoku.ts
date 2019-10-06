class Sudoku {
    cells: number[][];
    private candidates : number[][][];
    constructor(cells: number[][]) {
        this.cells = cells;
        this.candidates = [];
        for(let x=0; x<9; x++) {
            this.candidates[x] = [];
            for (let y=0; y<9; y++) {
                this.candidates[x][y] = [1,2,3,4,5,6,7,8,9];
            }
        }
    }

    getCandidates(row, column) {
        return this.candidates[row][column];
    }
    private isLegalRow(row) {
        if(row<0 || row>8) {
            console.error("legalRow: row out of range: " + row);
            return false;
        }
        for(let number=1; number<=9; number++) {
            let c = 0;
            for(let i=0; i<9; i++) {
                if(this.cells[row][i] == number) {
                    c++;
                }
            }
            if (c>1) {
                console.log("Illegal row " + row + ": Duplicated number " + number);
                return false;
            }
        }
        return true;
    }

    private isLegalColumn(column) {
        if(column<0 || column>8) {
            console.error("legalColumn: column out of range: " + column);
            return false;
        }
        for(let number=1; number<=9; number++) {
            let c = 0;
            for(let i=0; i<9; i++) {
                if(this.cells[i][column] == number) {
                    c++;
                }
            }
            if (c>1) {
                console.log("Illegal column " + column + ": Duplicated number " + number);
                return false;
            }
        }
        return true;
    }

    private isLegalBox(box) {
        if(box<0 || box>8) {
            console.error("legalBox: box out of range: " + box);
            return false;
        }
        for(let number=1; number<=9; number++) {
            let c = 0;
            for (let ii=0; ii<3; ii++) {
                let i = 3*(Math.floor(box/3))+ii;
                for (let jj=0; jj<3; jj++) {
                    let j = (3*(box%3))+jj; 
                    if(this.cells[i][j] == number) {
                        c++;
                    }
                }
            }
            if (c>1) {
                console.log("Illegal box " + box + ": Duplicated number " + number);
                return false;
            }
        }
        return true;
    }

    private isRowSolved(row) {
        for(let number=1; number<=9; number++) {
            let found = false;
            for(let col=0; col<=9 && !found; col++) {
                if (this.cells[row][col] == number) {
                    found = true;
                }
            }
            if(!found) {
                console.log("isRowSolved: Row " + row + " is not solved");
                return false;
            }
        }
        return true;
    }

    private isColumnSolved(col) {
        for(let number=1; number<=9; number++) {
            let found = false;
            for(let row=0; row<=9 && !found; row++) {
                if (this.cells[row][col] == number) {
                    found = true;
                }
            }
            if(!found) {
                console.log("isColumnSolved: Column " + col + " is not solved");
                return false;
            }
        }
        return true;
    }

    private isBoxSolved(box) {
        for(let number=1; number<=9; number++) {
            let found = false;
            for (let ii=0; ii<3 && !found; ii++) {
                let row = 3*(Math.floor(box/3))+ii;
                for (let jj=0; jj<3 && !found; jj++) {
                    let col = (3*(box%3))+jj; 
                    if (this.cells[row][col] == number) {
                        found = true;
                    }
                }
            }
            if(!found) {
                console.log("isBoxSolved: Box " + box + " is not solved");
                return false;
            }
        }
        return true;
    }

    isSolved() {
        for(let i=0; i<9; i++){ 
            if(!this.isRowSolved(i)) {
                return false;
            }
            if(!this.isColumnSolved(i)) {
                return false;
            }
            if(!this.isBoxSolved(i)) {
                return false;
            }
        }
        return true;
    }

    private promoteCandidateToPermanent(x, y){
        //Remove from candidates and add to cells
        let c = this.candidates[x][y].pop();
        this.cells[x][y] = c;
        console.log("["+x+","+y+"]="+c);
        //Remove from candidates in the row
        for (let i=0; i<9; i++) {
            let position = this.candidates[x][i].indexOf(c);
            if (position != -1) {
                this.candidates[x][i].splice(position,1);
                if(this.candidates[x][i].length == 1) {
                    this.promoteCandidateToPermanent(x,i);
                }
            }
        }
        //Remove from candidates in the col
        for (let i=0; i<9; i++) {
            let position = this.candidates[i][y].indexOf(c);
            if (position != -1) {
                this.candidates[i][y].splice(position,1);
                if(this.candidates[i][y].length == 1) {
                    this.promoteCandidateToPermanent(i,y);
                }
            }
        }

        //Remove from candidates in the 3x3 box
        for (let ii=0; ii<3; ii++) {
            let i = (3*Math.floor(x/3))+ii;
            for (let jj=0; jj<3; jj++) {
                let j = (3*Math.floor(y/3))+jj; 
                let position = this.candidates[i][j].indexOf(c);
                if (position != -1) {
                    this.candidates[i][j].splice(position,1);
                    if(this.candidates[i][j].length == 1) {
                        this.promoteCandidateToPermanent(i,j);
                    }
                }
            }
        }
    }

    isLegal() {
        for(let i=0; i<9; i++){ 
            if(!this.isLegalRow(i)) {
                return false;
            }
            if(!this.isLegalColumn(i)) {
                return false;
            }
            if(!this.isLegalBox(i)) {
                return false;
            }
        }
        return true;
    }

    solve() {
        for(let x=0; x<9; x++) {
            for(let y=0; y<9; y++) {
                if(this.cells[x][y] != 0) {
                    this.candidates[x][y] = [this.cells[x][y]];
                }
            }
        }
        for(let x=0; x<9; x++) {
            for(let y=0; y<9; y++) {
                if(this.candidates[x][y].length == 1) {
                    this.promoteCandidateToPermanent(x,y);       
                }
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