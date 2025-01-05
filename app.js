// Maze Dimensions
let rows = 10;
let cols = 10;

// Maze Matrix
let maze = [];
let path = [];

// Difficulty Levels (easy, medium, hard)
const difficultySettings = {
    easy: { rows: 10, cols: 10, wallDensity: 0.2 },
    medium: { rows: 15, cols: 15, wallDensity: 0.3 },
    hard: { rows: 20, cols: 20, wallDensity: 0.4 }
};

// Generate Maze with random walls
function generateMaze() {
    const difficulty = document.getElementById('difficulty').value;
    const settings = difficultySettings[difficulty];

    rows = settings.rows;
    cols = settings.cols;
    maze = Array.from({ length: rows }, () => Array(cols).fill(0));
    
    // Place random walls
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            maze[i][j] = Math.random() < settings.wallDensity ? 1 : 0;
        }
    }
    
    // Ensure start and end points are free
    maze[0][0] = 2; // Start
    maze[rows - 1][cols - 1] = 3; // End

    renderMaze();
}

// Render the Maze
function renderMaze() {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';
    mazeContainer.style.gridTemplateColumns = `repeat(${cols}, 35px)`;

    maze.forEach((row, rowIndex) => {
        row.forEach((cell, colIndex) => {
            const cellElement = document.createElement('div');
            cellElement.className = 'cell';

            if (cell === 1) cellElement.classList.add('wall');
            else if (cell === 2) cellElement.classList.add('start');
            else if (cell === 3) cellElement.classList.add('end');

            cellElement.addEventListener('click', () => toggleCell(rowIndex, colIndex));
            mazeContainer.appendChild(cellElement);
        });
    });
}

// Toggle Cell Between Wall and Path
function toggleCell(row, col) {
    if (maze[row][col] === 2 || maze[row][col] === 3) return;
    maze[row][col] = maze[row][col] === 1 ? 0 : 1;
    renderMaze();
}

// Solve Maze Using Selected Algorithm
function solveMaze() {
    const algorithm = document.getElementById('algorithm').value;

    switch (algorithm) {
        case 'bfs':
            bfsSolve();
            break;
        case 'dfs':
            dfsSolve();
            break;
        case 'aStar':
            aStarSolve();
            break;
        default:
            alert('Algorithm not selected');
    }
}

// BFS Algorithm to Solve Maze
function bfsSolve() {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const queue = [[0, 0, []]]; // [x, y, path]

    while (queue.length > 0) {
        const [x, y, currentPath] = queue.shift();

        if (x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y] || maze[x][y] === 1) continue;

        currentPath.push([x, y]);
        visited[x][y] = true;

        if (maze[x][y] === 3) {
            path = currentPath;
            animatePath();
            return;
        }

        directions.forEach(([dx, dy]) => {
            queue.push([x + dx, y + dy, [...currentPath]]);
        });
    }
    alert('No solution found!');
}

// DFS Algorithm to Solve Maze
function dfsSolve() {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const stack = [[0, 0, []]]; // [x, y, path]

    while (stack.length > 0) {
        const [x, y, currentPath] = stack.pop();

        if (x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y] || maze[x][y] === 1) continue;

        currentPath.push([x, y]);
        visited[x][y] = true;

        if (maze[x][y] === 3) {
            path = currentPath;
            animatePath();
            return;
        }

        directions.forEach(([dx, dy]) => {
            stack.push([x + dx, y + dy, [...currentPath]]);
        });
    }
    alert('No solution found!');
}

// A* Algorithm to Solve Maze
function aStarSolve() {
    // A* algorithm implementation (simplified)
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
    const openList = [[0, 0, 0, 0, []]]; // [x, y, g, f, path] (g = cost, f = g + heuristic)

    while (openList.length > 0) {
        openList.sort((a, b) => a[3] - b[3]); // Sort by f value
        const [x, y, g, f, currentPath] = openList.shift();

        if (x < 0 || x >= rows || y < 0 || y >= cols || visited[x][y] || maze[x][y] === 1) continue;

        currentPath.push([x, y]);
        visited[x][y] = true;

        if (maze[x][y] === 3) {
            path = currentPath;
            animatePath();
            return;
        }

        directions.forEach(([dx, dy]) => {
            const newG = g + 1;
            const h = Math.abs(x - (rows - 1)) + Math.abs(y - (cols - 1)); // Manhattan distance
            openList.push([x + dx, y + dy, newG, newG + h, [...currentPath]]);
        });
    }
    alert('No solution found!');
}

// Animate Path Step-by-Step
function animatePath() {
    let index = 0;
    const interval = setInterval(() => {
        const [x, y] = path[index];
        const cellElement = document.querySelector(
            `.maze .cell:nth-child(${x * cols + y + 1})`
        );
        cellElement.classList.add('path');
        index++;

        if (index === path.length) {
            clearInterval(interval);
        }
    }, 100);
}

// Reset Maze
function resetMaze() {
    generateMaze();
}

// Event Listeners
document.getElementById('generateMazeBtn').addEventListener('click', generateMaze);
document.getElementById('solveMazeBtn').addEventListener('click', solveMaze);
document.getElementById('resetMazeBtn').addEventListener('click', resetMaze);

// Initial Maze Generation
generateMaze();
