let initValues = [];
for(let i=0; i< 9; i++) {
    initValues[i] = [];
    for(let j=0; j< 9; j++) {
        let v = document.getElementById("f"+j+i).value;
        initValues[i][j] = v != "" ? Number(v) : 0;
    }
}
let s = new Sudoku(initValues);
s.solve();
if(s.isSolved()) {
    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            document.getElementById("f"+j+i).value = s.cells[i][j];
        }
    }
} else {
    for(let i=0; i<9; i++) {
        for(let j=0; j<9; j++) {
            if(s.cells[i][j]>0) {
                document.getElementById("f"+j+i).value = s.cells[i][j];
            } else {
                if(s.candidates[i][j].length == 2) {
                    document.getElementById("f"+j+i).className = "w0";
                }
                else if(s.candidates[i][j].length > 2) {
                    document.getElementById("f"+j+i).className = "v0";
                }
                document.getElementById("f"+j+i).value = (s.candidates[i][j]).toString();
            }
        }
    }
    console.error("Solution not found");
    console.log(s.cells);
}