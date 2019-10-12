/*export*/ class Sudoku {
    cells: number[][];
    private candidates : number[][][];

    constructor(cells: number[][]) {
        this.cells = cells;
        this.candidates = [];
        for(let x=0; x<9; x++) {
            this.candidates[x] = [];
            for (let y=0; y<9; y++) {
                this.candidates[x][y] = [1,2,3,4,5,6,7,8,9]; 
                //by initialising the set cells to a single candidate, I can
                //treat them as any other cell that had just been reduced to a
                //value, without the need of processing these separatedly.
                if(this.cells[x][y] != 0) {
                    this.candidates[x][y] = [this.cells[x][y]];
                }
            }
        }
    }

    getCandidates(row:number, column:number) {
        return this.candidates[row][column];
    }

    private isLegalRow(row:number) {
        if(row<0 || row>8) {
            console.error("isLegalRow: row out of range: " + row);
            return false;
        }
        for(let n=1; n<=9; n++) {
            let c = 0;
            for(let i=0; i<9; i++) {
                if(this.cells[row][i] == n) {
                    c++;
                }
            }
            if (c>1) {
                console.log("isLegalRow " + row + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }

    private isLegalColumn(column:number) {
        if(column<0 || column>8) {
            console.error("isLegalColumn: column out of range: " + column);
            return false;
        }
        for(let n=1; n<=9; n++) {
            let c = 0;
            for(let i=0; i<9; i++) {
                if(this.cells[i][column] == n) {
                    c++;
                }
            }
            if (c>1) {
                console.log("isLegalColumn: " + column + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }

    private isLegalBox(box) {
        if(box<0 || box>8) {
            console.error("islegalBox: box out of range: " + box);
            return false;
        }
        for(let n=1; n<=9; n++) {
            let c = 0;
            for (let ii=0; ii<3; ii++) {
                let i = 3*(Math.floor(box/3))+ii;
                for (let jj=0; jj<3; jj++) {
                    let j = (3*(box%3))+jj; 
                    if(this.cells[i][j] == n) {
                        c++;
                    }
                }
            }
            if (c>1) {
                console.log("isLegalBox: " + box + ": Duplicated number " + n);
                return false;
            }
        }
        return true;
    }

    private isRowSolved(row:number) {
        for(let n=1; n<=9; n++) {
            let found:boolean = false;
            for(let col=0; col<9 && !found; col++) {
                if (this.cells[row][col] == n) {
                    found = true;
                }
            }
            if(!found) {
                return false;
            }
        }
        return true;
    }

    private isColumnSolved(col:number) {
        for(let n=1; n<=9; n++) {
            let found = false;
            for(let row=0; row<9 && !found; row++) {
                if (this.cells[row][col] == n) {
                    found = true;
                }
            }
            if(!found) {
                return false;
            }
        }
        return true;
    }

    private isBoxSolved(box:number) {
        for(let n=1; n<=9; n++) {
            let found = false;
            for (let ii=0; ii<3 && !found; ii++) {
                let row = 3*(Math.floor(box/3))+ii;
                for (let jj=0; jj<3 && !found; jj++) {
                    let col = (3*(box%3))+jj; 
                    if (this.cells[row][col] == n) {
                        found = true;
                    }
                }
            }
            if(!found) {
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

    private promoteCandidateToPermanent(row, col){
        //Remove from candidates and add to cells
        let c = this.candidates[row][col].pop();
        this.cells[row][col] = c;
        //console.log("["+row+"]["+col+"]="+c);
        if(!this.isLegalRow(row)) {
            console.error("isLegalRow: duplicated value " + c + " in row while setting cell " + row +", " +col);
        }
        if(!this.isLegalColumn(col)) {
            console.error("isLegalColumn: duplicated value " + c + " in column while setting cell " + row +", " +col);
        }
        let box = Math.floor(row/3) + col%3; 
        if(!this.isLegalBox(box)) {
            console.error("isLegalBox: duplicated value " + c + " in box while setting cell " + row +", " +col);
        }
        
        //Remove from candidates in the row
        for (let i=0; i<9; i++) {
            let position = this.candidates[row][i].indexOf(c);
            if (position != -1) {
                this.candidates[row][i].splice(position,1);
                if(this.candidates[row][i].length == 1) {
                    this.promoteCandidateToPermanent(row,i);
                }
            }
        }
        //Remove from candidates in the col
        for (let i=0; i<9; i++) {
            let position = this.candidates[i][col].indexOf(c);
            if (position != -1) {
                this.candidates[i][col].splice(position,1);
                if(this.candidates[i][col].length == 1) {
                    this.promoteCandidateToPermanent(i,col);
                }
            }
        }

        //Remove from candidates in the 3x3 box
        for (let ii=0; ii<3; ii++) {
            let i = (3*Math.floor(row/3))+ii;
            for (let jj=0; jj<3; jj++) {
                let j = (3*Math.floor(col/3))+jj; 
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

    private nonRepeatingCandidatesInRow(row:number) {
        let changed:boolean = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the row. 
        let localCandidates = new Map();
        for(let col=0; col<9; col++) {
            for (let i=0; i<this.candidates[row][col].length; i++) {
                let c = this.candidates[row][col][i];
                if(!localCandidates.has(c)) {
                    localCandidates.set(c, col);
                } else {
                    //value has been seen before. set to -1 as a flag that 
                    //the candidate is not unique
                    localCandidates.set(c,-1);
                }
            }
        }
        for (let n=1; n<=9; n++) {
            if(localCandidates.has(n) && localCandidates.get(n)>=0) {
                let col = localCandidates.get(n);
                this.candidates[row][col].length=0;
                this.candidates[row][col].push(n); 
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
    }

    private nonRepeatingCandidatesInColumn(col:number) {
        let changed:boolean = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the column. 
        let localCandidates = new Map();
        for(let row=0; row<9; row++) {
            for (let i=0; i<this.candidates[row][col].length; i++) {
                let c = this.candidates[row][col][i];
                if(!localCandidates.has(c)) {
                    localCandidates.set(c, row);
                } else {
                    //value has been seen before. set to -1 as a flag that 
                    //the candidate is not unique
                    localCandidates.set(c,-1);
                }
            }
        }
        for (let n=1; n<=9; n++) {
            if(localCandidates.has(n) && localCandidates.get(n)>=0) {
                let row = localCandidates.get(n);
                this.candidates[row][col].length=0;
                this.candidates[row][col].push(n); 
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
    }

    private nonRepeatingCandidatesInBox(box:number) {
        let changed:boolean = false;
        //localCandidates is a map of values that had been found from the candidates
        //in the other cells in the column. 
        let localCandidates = new Map();
        for (let ii=0; ii<3; ii++) {
            let row = 3*(Math.floor(box/3))+ii;
            for (let jj=0; jj<3; jj++) {
                let col = (3*(box%3))+jj; 
                for (let i=0; i<this.candidates[row][col].length; i++) {
                    let c = this.candidates[row][col][i];
                    if(!localCandidates.has(c)) {
                        localCandidates.set(c, 3*ii + jj);
                    } else {
                        //value has been seen before. set to -1 as a flag that 
                        //the candidate is not unique
                        localCandidates.set(c,-1);
                    }
                }
            }
        }
        for (let n=1; n<=9; n++) {
            if(localCandidates.has(n) && localCandidates.get(n)>=0) {
                let row = 3*(Math.floor(box/3)) + Math.floor(localCandidates.get(n)/3);
                let col = 3*(box%3) + localCandidates.get(n)%3;
                this.candidates[row][col].length=0;
                this.candidates[row][col].push(n); 
                this.promoteCandidateToPermanent(row, col);
                changed = true;
            }
        }
        return changed;
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
    
    clone() {
        let cells = [];
        for(let row=0; row<9; row++) {
            cells[row] = [];
            for(let col=0; col<9; col++) {
                cells[row][col] = this.cells[row][col];
            }
        }
        let c:Sudoku = new Sudoku(cells);
        for(let row=0;row<9;row++) {
            for (let col=0; col<9; col++) {
                c.candidates[row][col]=this.candidates[row][col].slice();
            }
        }
        return c;
    }

    solve() {
        //Although it seems redundant, knowing that promoteCandidateToPermanent(row, col) will 
        //recursively call itself when it finds a list of candidates reduced to one single 
        //value, I'm going through the board calling that function for the initial values.
        for(let row=0; row<9; row++) {
            for(let col=0; col<9; col++) {
                if(this.candidates[row][col].length == 1) {
                    this.promoteCandidateToPermanent(row, col);       
                }
            }
        }
        if(this.isSolved()) return;

        //Once the algorithm reaches this point, the recursive calls to promoteCandidateToPermanent
        //will have taken care of all the values that can be found by simply eliminating known set
        //values from the corresponding rows, columns and boxes. At this point the board is either
        //solved or there are no cells with a single candidate value. They all have 2 or more.
        
        //This next step finds cells that contain one value on their candidates list that is not present 
        //in any of the candidates lists for the same row, column or box
        let changed = true;
        while(changed) {
            changed = false;
            for(let row=0; row<9 && !changed; row++) {
               changed = this.nonRepeatingCandidatesInRow(row);
            }
            for(let col=0; col<9 && !changed; col++) {
               changed = this.nonRepeatingCandidatesInColumn(col);
            }
            for(let box=0; box<9 && !changed; box++) {
               changed = this.nonRepeatingCandidatesInBox(box);
            }
        }
        if(this.isSolved()) return;

        //Got to this point, we need to start speculating on values, with a backtracking strategy
        //To minimise the ramifications, we start with the smallest list of candidates
        let candidatesCount:number = 2;
        while(!this.isSolved() && candidatesCount <= 9) {
            for (let row:number=0; row<9; row++) {
                for (let col:number=0; col<9; col++) {
                    if (this.candidates[row][col].length == candidatesCount) {
                        while(this.candidates[row][col].length > 0) {
                            let r:Sudoku = this.clone();
                            r.cells[row][col] = r.candidates[row][col].pop();
                            r.candidates[row][col].length = 0;
                            r.candidates[row][col].push(r.cells[row][col]);
                            r.solve();
                            if(r.isSolved()) {
                                this.cells = r.cells.slice();
                                return;
                            } else {
                                this.candidates[row][col].pop();
                            }
                        }
                    }
                }
            }
            candidatesCount++;
        }
    }
} 