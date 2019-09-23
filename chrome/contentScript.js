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
for(let i=0; i< 9; i++) {
    for(let j=0; j< 9; j++) {
        document.getElementById("f"+j+i).value = s.cells[i][j];
    }
}
