var assert = require('assert');
const Sudoku = require('../chrome/websudoku.js').Sudoku;

describe('Array', function () {
  describe('#indexOf()', function () {
    it('should return -1 when the value is not present', function () {
      assert.equal([1, 2, 3].indexOf(4), -1);
    });
  });
});
describe('Sudoku', function () {
  let testCells = [[0, 5, 1, 0, 0, 0, 9, 0, 7],
  [0, 9, 2, 0, 0, 9, 0, 0, 9],
  [0, 0, 7, 0, 1, 9, 0, 5, 0],
  [0, 1, 0, 8, 9, 0, 0, 3, 0],
  [9, 0, 0, 0, 4, 0, 0, 0, 6],
  [0, 2, 0, 0, 5, 7, 0, 8, 0],
  [0, 9, 0, 7, 2, 0, 8, 0, 0],
  [2, 0, 0, 4, 0, 0, 6, 7, 0],
  [1, 0, 8, 0, 0, 0, 3, 2, 0]];
  let s = new Sudoku(testCells);
  describe('#isLegalRow()', function () {
    it('should return -1 when the index is out of range and false when there are repeating elements', function () {
      assert.equal(s.isLegalRow(-1), false);
      assert.equal(s.isLegalRow(0), true);
      assert.equal(s.isLegalRow(8), true);
      assert.equal(s.isLegalRow(9), false);
      assert.equal(s.isLegalRow(1), false);
    });
  });
  describe('#isLegalColumn()', function () {
    it('should return -1 when the index is out of range and false when there are repeating elements', function () {
      assert.equal(s.isLegalColumn(-1), false);
      assert.equal(s.isLegalColumn(0), true);
      assert.equal(s.isLegalColumn(8), true);
      assert.equal(s.isLegalColumn(9), false);
      assert.equal(s.isLegalColumn(1), false);
    });
  });
  describe('#isLegalBox()', function () {
    it('should return -1 when the index is out of range and false when there are repeating elements', function () {
      assert.equal(s.isLegalBox(-1), false);
      assert.equal(s.isLegalBox(0), true);
      assert.equal(s.isLegalBox(8), true);
      assert.equal(s.isLegalBox(9), false);
      assert.equal(s.isLegalBox(1), false);
    });
  });
  describe('#isRowSolved()', function () {
    it('should return true when all numbers from 1 to 9 are present', function () {
      assert.equal(s.isRowSolved(0), false);
      s.cells[0] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    });
  });
  describe('#isColumnSolved()', function () {
    it('should return true when all numbers from 1 to 9 are present', function () {
      assert.equal(s.isColumnSolved(0), false);
      s.cells[0][0]=1;
      s.cells[1][0]=2;
      s.cells[2][0]=3;
      s.cells[3][0]=4;
      s.cells[4][0]=5;
      s.cells[5][0]=6;
      s.cells[6][0]=7;
      s.cells[7][0]=8;
      s.cells[8][0]=9;
      assert.equal(s.isColumnSolved(0), true);
    });
  });
  describe('#isBoxSolved()', function () {
    it('should return true when all numbers from 1 to 9 are present', function () {
      assert.equal(s.isBoxSolved(0), false);
      s.cells[0][0]=1;
      s.cells[0][1]=2;
      s.cells[0][2]=3;
      s.cells[1][0]=4;
      s.cells[1][1]=5;
      s.cells[1][2]=6;
      s.cells[2][0]=7;
      s.cells[2][1]=8;
      s.cells[2][2]=9;
      assert.equal(s.isBoxSolved(0), true);
    });
  });
  describe('#solve()', function () {
    it('miscelanea debugging tests ', function () {
      let t = [
        [0, 0, 0, 0, 6, 0, 8, 1, 0],
        [0, 0, 0, 0, 7, 0, 0, 0, 0],
        [2, 5, 0, 8, 0, 4, 0, 0, 6],
        [0, 1, 0, 6, 0, 0, 0, 0, 5],
        [0, 0, 8, 0, 5, 0, 3, 0, 0],
        [7, 0, 0, 0, 0, 3, 0, 2, 0],
        [5, 0, 0, 7, 0, 8, 0, 9, 2],
        [0, 0, 0, 0, 1, 0, 0, 0, 0],
        [0, 9, 3, 0, 2, 0, 0, 0, 0]];
      let su = new Sudoku(t);
      assert.equal(su.isSolved(), false);
      su.solve();
      assert.equal(su.isSolved(), true);
    });
  });
});