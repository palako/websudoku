# websudoku
Code to solve sudokus, taken from websudoku.com

The websudoku.com page contains a frame that is normally hosted as nine.websudoku.com. Because of how chrome extensions deal with frames, so far I've decided to invoke nine.websudoku.com directly in the URL bar and avoid the messaging part. Might (or not) get to that in the future.

The Sudoku class is written in TypeScript and compiles to the chrome directory with tsc.

This is just my learning project to have a look at TypeScript. Using websudoku it's just a convenient way to have tons and tons of sudokus to test without having to type them in, and of varying levels of dificulty.
