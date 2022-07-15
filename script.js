function new_grid () {
    let grid = document.getElementById("container");
    grid.innerHTML = "";
    for (let i = 0; i < 81; i++) {
        let square = document.createElement("input");
        square.setAttribute("id", i);
        square.setAttribute("type", "number");
        square.setAttribute("min", "1");
        square.setAttribute("max", "10");
        square.setAttribute("class", "tile");
        if ((i >= 54 && i <= 62) || (i >= 27 && i <= 35)) { square.classList.add("top-border");}
        grid.appendChild(square);
    }
}

window.onload = function() {
    new_grid();
};

function dfs (index) {
    if (index > 80) { return ;}
    if (soduku[index] !== "") { dfs(index + 1);}
    else {
        for (let j = 1; j < 10; j++) {
            // check validity
            sudoku[index] = j;
            dfs(index + 1);
        }
    }
}

function check_number ()

function solve() {
    let grid = document.querySelectorAll(".tile");
    let sudoku = [];
    grid.forEach(tile => {
        if (tile.value !== null) { 
            sudoku.push(tile.value);
            tile.classList.add("green");
        }
        else {
            sudoku.push("");
        }
    });
    
    let i = 0;
    while (i < 81) {
        if (sudoku[i] === "") {
            dfs (i);
            break;
        }
        i++;
    }

}