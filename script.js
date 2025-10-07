// Variables
const boardElement = document.getElementById("board");
const statusElement = document.getElementById("status");
const resetBtn = document.getElementById("reset");
const pvpBtn = document.getElementById("pvp");
const aiBtn = document.getElementById("ai");

let board = Array(9).fill("");
let currentPlayer = "X";
let gameOver = false;
let vsAI = false;

// Winning combinations
const winPatterns = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]          // diagonals
];

// Initialize board
function createBoard() {
  boardElement.innerHTML = "";
  board.forEach((cell, index) => {
    const cellElement = document.createElement("div");
    cellElement.classList.add("cell");
    cellElement.dataset.index = index;
    cellElement.addEventListener("click", onCellClick);
    boardElement.appendChild(cellElement);
  });
}

// Handle cell click
function onCellClick(e) {
  const index = e.target.dataset.index;

  if (board[index] !== "" || gameOver) return;

  board[index] = currentPlayer;
  e.target.textContent = currentPlayer;

  if (checkWinner(currentPlayer)) {
    statusElement.textContent = `${currentPlayer} Wins! 🎉`;
    gameOver = true;
    return;
  } else if (!board.includes("")) {
    statusElement.textContent = "It's a Draw! 🤝";
    gameOver = true;
    return;
  }

  // Switch player
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  statusElement.textContent = `Player ${currentPlayer}'s turn`;

  // AI Move
  if (vsAI && currentPlayer === "O" && !gameOver) {
    setTimeout(aiMove, 500);
  }
}

// AI logic (random move)
function aiMove() {
  let emptyCells = board
    .map((val, idx) => (val === "" ? idx : null))
    .filter(val => val !== null);

  const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  board[randomIndex] = "O";
  document.querySelector(`[data-index='${randomIndex}']`).textContent = "O";

  if (checkWinner("O")) {
    statusElement.textContent = "AI Wins! 🤖";
    gameOver = true;
  } else if (!board.includes("")) {
    statusElement.textContent = "It's a Draw! 🤝";
    gameOver = true;
  } else {
    currentPlayer = "X";
    statusElement.textContent = `Player ${currentPlayer}'s turn`;
  }
}

// Check winner
function checkWinner(player) {
  return winPatterns.some(pattern =>
    pattern.every(index => board[index] === player)
  );
}

// Reset game
function resetGame() {
  board = Array(9).fill("");
  currentPlayer = "X";
  gameOver = false;
  createBoard();
  statusElement.textContent = `Player ${currentPlayer}'s turn`;
}

// Mode selection
pvpBtn.addEventListener("click", () => {
  vsAI = false;
  resetGame();
  statusElement.textContent = "Player X's turn (PVP Mode)";
});

aiBtn.addEventListener("click", () => {
  vsAI = true;
  resetGame();
  statusElement.textContent = "Player X's turn (vs AI)";
});

resetBtn.addEventListener("click", resetGame);

// Start game
createBoard();
