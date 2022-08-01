// Global variables
const directions = 
{
    0 : [1, 2],
    1 : [-1, 1],
    2 : [-2, -1]
};
let sudoku = [];
let solved = false; // When true, solution found
let solvable = true; // when false, solution not possible
let comment = document.getElementById("comment");

window.onload = function() {
    new_grid();
};

let solveButton = document.getElementById("solve");
solveButton.addEventListener("click", solve);

let clearButton = document.getElementById("clear");
clearButton.addEventListener("click", new_grid);

function new_grid () {
    // Creates new empty grid
    
    let grid = document.getElementById("container");
    grid.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        let square = document.createElement("input");
        square.setAttribute("id", i);
        square.setAttribute("type", "number");
        square.setAttribute("min", "1");
        square.setAttribute("max", "9");
        square.setAttribute("class", "tile");
        
        // Add classes for sudoku view
        if ((i < 27 && i > 17) || (i > 44 && i < 54)) { square.classList.add("bot-border");}
        if ((i < 36 && i > 26) || (i > 53 && i < 63)) { square.classList.add("top-border");}
        if (i % 9 === 3 || i % 9 === 6) { square.classList.add("left-border");}
        if (i % 9 === 2 || i % 9 === 5) { square.classList.add("right-border");}
        grid.appendChild(square);
    }

    sudoku = [];

    // Empty the comment box
    comment.innerHTML = "";
    comment.style.display = "none";
    
    // Let the user click again
    document.getElementById("solve").disabled = false; 
}

function dfs (row, col) {
    if (solved === true || solvable === false) {return;}

    // check for success
    if (row === 9) { 
        solved = true;
        printSolution(sudoku);
        return;
    }

    // Skip tile if num is set for the sudoku
    if (sudoku[row][col] !== "") { 
        if (checkNumber(row, col, sudoku[row][col]) === false){
            solvable = false;
            return;
        }
        if (col === 8) {
            dfs(row + 1, 0);
        }
        else {
            dfs(row, col + 1);
        }
    }
    else {
        for (let j = 1; j < 10; j++) {
            // Check for validity and go to the next nr if the number is not valid
            if (checkNumber(row, col, j) === false) {
                continue;
            }
            
            sudoku[row][col] = j;

            if (col === 8) {
                dfs(row + 1, 0);
            }
            else {
                dfs(row, col + 1);
            }
                
        }
        // reset number in square to default empty value if no succes
        sudoku[row][col] = "";
    }
}

function checkNumber(row, col, newNum) {  
    // find where in the 3x3 square the tile is in
    let posR = row % 3;
    let posC = col % 3;
    
    // Check for duplicates in tiles in same 3x3 not on row or col
    if (sudoku[row + directions[posR][0]][col + directions[posC][0]] === newNum) { return false;}
    if (sudoku[row + directions[posR][0]][col + directions[posC][1]] === newNum) { return false;}
    if (sudoku[row + directions[posR][1]][col + directions[posC][0]] === newNum) { return false;}
    if (sudoku[row + directions[posR][1]][col + directions[posC][1]] === newNum) { return false;}

    
    for (let x = 0; x < 9; x++) {
        // Check for duplicates in row
        if (col !== x ) {
            if (newNum === sudoku[row][x]) { 
                return false;
            }
        }
        // Check for duplicates in col
        if (row !== x ) {
            if (newNum === sudoku[x][col]) {
                return false;
            }
        }
    }
    return true;
}

function solve() {
    // When the solve button is clicked, solve the sudoku with the provided values
    
    // Prevent the user from clicking again
    document.getElementById("solve").disabled = true; 

    // Check for unsolvable starting input
    solved = false;
    solvable = true;

    // collect all tiles in an array
    let grid = document.querySelectorAll(".tile");

    // empty array to prepare to enter grid values
    sudoku = [[],[],[],[],[],[],[],[],[]];
    
    let counter = 0;
    let rowNum = 0;
    let val;
    let validEntries = true;

    
    // Enter the user entered values into the array
    grid.forEach(tile => {
        rowNum = Math.floor(counter / 9);
        if (tile.value !== "") { 
            val = parseInt(tile.value);
            if (val === NaN || val > 9 || val < 1) {
                tile.classList.add("red");
                validEntries = false;
                return;
            }
            sudoku[rowNum].push(val);
            
            // Add class to color tile green to indicate that the number was provided by user
            tile.classList.add("green");
        }
        else {
            // For not entered values, add an empty string
            sudoku[rowNum].push("");
        }
        counter++;
    });


    // Stop if invalid entry entered
    if (validEntries === false) {
        faultyEntry();
        return;
    }

    dfs(0, 0);

    // Let the user know that the entered sudoku is not solvable
    if (solved === false || solvable === false) { noSolution();}

}

function printSolution() {
    // Prints the solution to the roster

    let counter = 0;
    let grid = document.querySelectorAll(".tile");
    for (let i = 0; i < 9; i++){
        for (let j = 0; j < 9; j++) {
            grid[counter].value = sudoku[i][j];
            counter++;
        }
    }
}

function faultyEntry() {
    // Wrong entry values entered.
    comment.innerHTML = "Please only enter numeric values from 1 - 9";
    comment.style.display = "inline";
}


function noSolution() {
    // No solution is possible
    comment.innerHTML = "No possible solutions, please enter different starting values";
    comment.style.display = "inline";
}
