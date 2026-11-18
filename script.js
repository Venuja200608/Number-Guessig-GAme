// ----- Game settings -----
const MAX_ATTEMPTS = 3;
const MIN_NUMBER = 1;
const MAX_NUMBER = 10;

// ----- Game state -----
let randomNumber;
let attempts;
let gameOver;

// ----- Get elements from the page -----
const guessInput = document.getElementById("guessInput");
const guessBtn = document.getElementById("guessBtn");
const againBtn = document.getElementById("againBtn");
const resultTable = document.getElementById("resultTable");
const resultBody = document.getElementById("resultBody");

const overlay = document.getElementById("overlay");
const popupIcon = document.getElementById("popupIcon");
const popupMessage = document.getElementById("popupMessage");
const okBtn = document.getElementById("okBtn");

// ----- Functions -----
function generateRandomNumber() {
  return Math.floor(Math.random() * MAX_NUMBER) + MIN_NUMBER;
}

function startGame() {
  randomNumber = generateRandomNumber();
  attempts = 0;
  gameOver = false;

  resultBody.innerHTML = "";
  resultTable.classList.add("hidden");

  guessInput.value = "";
  guessInput.disabled = false;
  guessBtn.disabled = false;
  guessInput.focus();
}

function showPopup(type, message) {
  popupIcon.className = "icon " + type;
  popupIcon.textContent = type === "success" ? "✓" : "✕";
  popupMessage.textContent = message;
  overlay.classList.remove("hidden");
  okBtn.focus();
}

function closePopup() {
  overlay.classList.add("hidden");
  if (!gameOver) {
    guessInput.focus();
  }
}

function addRow(attemptNumber, guess) {
  const row = document.createElement("tr");

  const attemptCell = document.createElement("td");
  attemptCell.textContent = attemptNumber;

  const guessCell = document.createElement("td");
  guessCell.textContent = guess;

  row.appendChild(attemptCell);
  row.appendChild(guessCell);
  resultBody.appendChild(row);

  resultTable.classList.remove("hidden");
}

function endGame() {
  gameOver = true;
  guessInput.disabled = true;
  guessBtn.disabled = true;
}

function checkGuess() {
  if (gameOver) return;

  const guess = Number(guessInput.value);

  // Validation
  if (guessInput.value === "" || !Number.isInteger(guess) ||
      guess < MIN_NUMBER || guess > MAX_NUMBER) {
    showPopup("error", "Please enter a whole number between " + MIN_NUMBER + " and " + MAX_NUMBER + ".");
    return;
  }

  attempts++;
  addRow(attempts, guess);
  guessInput.value = "";

  if (guess === randomNumber) {
    endGame();
    showPopup("success", "Correct Guess!");
  } else if (attempts >= MAX_ATTEMPTS) {
    endGame();
    showPopup("error", "Game over! The number was " + randomNumber + ". Click Again to play.");
  } else {
    const left = MAX_ATTEMPTS - attempts;
    const hint = guess < randomNumber
      ? "Your guessing is less than the random number"
      : "Your guessing is greater than the random number";
    showPopup("error", hint + " (" + left + (left === 1 ? " attempt" : " attempts") + " left)");
  }
}

// ----- Events -----
guessBtn.addEventListener("click", checkGuess);
againBtn.addEventListener("click", startGame);
okBtn.addEventListener("click", closePopup);

guessInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") checkGuess();
});

document.addEventListener("keydown", function (event) {
  if (event.key === "Escape" && !overlay.classList.contains("hidden")) closePopup();
});

// ----- Start -----
startGame();