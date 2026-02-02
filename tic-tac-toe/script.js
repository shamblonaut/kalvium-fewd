// --- Global State ---
// Part I Step 2: Representing the board as a 2D Array
let board = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

let currentPlayer = "X";
let isGameActive = true;
let gameMode = "pvp"; // 'pvp' or 'ai'

// Part II Step 3: Stats Tracking
let stats = {
  X: 0,
  O: 0,
  draw: 0,
};

// DOM Elements
const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status-text");
const btnRematch = document.getElementById("btn-rematch");
const btnReset = document.getElementById("btn-reset");
const radioButtons = document.querySelectorAll('input[name="mode"]');
const scoreX = document.getElementById("score-x");
const scoreO = document.getElementById("score-o");
const scoreDraw = document.getElementById("score-draw");

// --- Initialization ---
function init() {
  cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
  btnRematch.addEventListener("click", rematchGame);
  btnReset.addEventListener("click", resetGame);

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", (e) => {
      gameMode = e.target.value;
      rematchGame(); // Restart board when mode changes
    });
  });
}

// --- Core Gameplay Logic (Part I Step 3) ---
function handleCellClick(e) {
  const row = parseInt(e.target.getAttribute("data-row"));
  const col = parseInt(e.target.getAttribute("data-col"));

  // Check if cell is empty and game is active
  if (board[row][col] !== null || !isGameActive) {
    return;
  }

  // Make the move
  executeMove(row, col, currentPlayer);

  // If Game is still active and it's AI mode, trigger AI
  if (isGameActive && gameMode === "ai" && currentPlayer === "O") {
    // Small delay for realism
    setTimeout(makeAIMove, 500);
  }
}

function executeMove(row, col, player) {
  // Update Data (2D Array)
  board[row][col] = player;

  // Update UI
  updateUI(row, col, player);

  // Part I Step 5: Check Win/Draw
  if (checkWin(player)) {
    endGame(false, player);
  } else if (checkDraw()) {
    endGame(true);
  } else {
    switchTurn();
  }
}

function updateUI(row, col, player) {
  // Find the specific cell in DOM based on data attributes
  const cell = document.querySelector(
    `.cell[data-row="${row}"][data-col="${col}"]`
  );
  cell.innerText = player;
  cell.classList.add(player.toLowerCase()); // Adds .x or .o class
}

function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusText.innerText = `Player ${currentPlayer}'s Turn`;
}

// --- Win/Draw Logic (Part I Step 4) ---
function checkWin(player) {
  // Check Rows
  for (let r = 0; r < 3; r++) {
    if (
      board[r][0] === player &&
      board[r][1] === player &&
      board[r][2] === player
    ) {
      highlightWin([
        [r, 0],
        [r, 1],
        [r, 2],
      ]);
      return true;
    }
  }
  // Check Columns
  for (let c = 0; c < 3; c++) {
    if (
      board[0][c] === player &&
      board[1][c] === player &&
      board[2][c] === player
    ) {
      highlightWin([
        [0, c],
        [1, c],
        [2, c],
      ]);
      return true;
    }
  }
  // Check Diagonals
  if (
    board[0][0] === player &&
    board[1][1] === player &&
    board[2][2] === player
  ) {
    highlightWin([
      [0, 0],
      [1, 1],
      [2, 2],
    ]);
    return true;
  }
  if (
    board[0][2] === player &&
    board[1][1] === player &&
    board[2][0] === player
  ) {
    highlightWin([
      [0, 2],
      [1, 1],
      [2, 0],
    ]);
    return true;
  }
  return false;
}

function checkDraw() {
  // Flatten 2D array to check if includes null
  return board.flat().every((cell) => cell !== null);
}

function highlightWin(coords) {
  coords.forEach(([r, c]) => {
    const cell = document.querySelector(
      `.cell[data-row="${r}"][data-col="${c}"]`
    );
    cell.classList.add("winner");
  });
}

function endGame(isDraw, winner = null) {
  isGameActive = false;
  if (isDraw) {
    statusText.innerText = "It's a Draw!";
    stats.draw++;
  } else {
    statusText.innerText = `Player ${winner} Wins!`;
    stats[winner]++;
  }
  updateScoreboard();
}

// --- Part II Features ---

// Step 1: AI Opponent (Random Move)
function makeAIMove() {
  if (!isGameActive) return;

  // Find all empty cells
  const emptyCells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      if (board[r][c] === null) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length > 0) {
    const randomIdx = Math.floor(Math.random() * emptyCells.length);
    const move = emptyCells[randomIdx];
    executeMove(move.r, move.c, "O");
  }
}

// Step 3: Stats Update
function updateScoreboard() {
  scoreX.innerText = stats.X;
  scoreO.innerText = stats.O;
  scoreDraw.innerText = stats.draw;
}

// Step 2: Rematch (Clear board, keep stats)
function rematchGame() {
  board = [
    [null, null, null],
    [null, null, null],
    [null, null, null],
  ];
  isGameActive = true;
  currentPlayer = "X";
  statusText.innerText = "Player X's Turn";

  cells.forEach((cell) => {
    cell.innerText = "";
    cell.className = "cell"; // Remove .x, .o, .winner
  });
}

// Part I Step 6 & Part II Step 4: Full Reset
function resetGame() {
  stats = { X: 0, O: 0, draw: 0 };
  updateScoreboard();
  rematchGame();
}

// Run Initialization
init();
