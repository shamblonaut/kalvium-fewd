
// DOM references
const rockButton = document.getElementById("rock");
const paperButton = document.getElementById("paper");
const scissorsButton = document.getElementById("scissors");
const playerChoiceDiv = document.getElementById("player-choice");
const computerChoiceDiv = document.getElementById("computer-choice");
const outcomeDiv = document.getElementById("outcome");
const playerScoreSpan = document.getElementById("player-score");
const computerScoreSpan = document.getElementById("computer-score");
const winStreakSpan = document.getElementById("win-streak");
const difficultySelect = document.getElementById("difficulty");
const themeSelect = document.getElementById("theme");
const highestStreakParagraph = document.getElementById("highest-streak");

// Constants
const CHOICES = ["rock", "paper", "scissors"];
const SOUNDS = {
  win: "assets/win.wav",
  lose: "assets/lose.wav",
  tie: "assets/tie.wav",
};

// State
let playerScore = 0;
let computerScore = 0;
let lastPlayerChoice = null;

// Preload and safe play for sounds
const audioCache = {};
function preloadSounds() {
  Object.keys(SOUNDS).forEach((k) => {
    try {
      const a = new Audio(SOUNDS[k]);
      a.load();
      audioCache[k] = a;
    } catch (e) {
      // ignore if audio cannot be loaded
    }
  });
}
function playSound(name) {
  const a = audioCache[name];
  if (!a) return;
  try {
    a.currentTime = 0;
    a.play();
  } catch (e) {
    // play failure (e.g., user hasn't interacted yet) - ignore
  }
}

// Initialization for highest streak
const savedHighest = parseInt(localStorage.getItem("highestStreak") || "0", 10) || 0;
highestStreakParagraph.textContent = String(savedHighest);

function getRandomChoice() {
  return CHOICES[Math.floor(Math.random() * CHOICES.length)];
}

function getStrategicChoice() {
  if (lastPlayerChoice === "rock") return "paper";
  if (lastPlayerChoice === "paper") return "scissors";
  if (lastPlayerChoice === "scissors") return "rock";
  return getRandomChoice();
}

function getComputerChoice(difficulty = "normal") {
  if (difficulty === "hard") return getStrategicChoice();
  if (difficulty === "normal") return Math.random() < 0.5 ? getRandomChoice() : getStrategicChoice();
  return getRandomChoice();
}

function capitalize(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

function celebrateWin() {
  outcomeDiv.classList.add("win");
  setTimeout(() => outcomeDiv.classList.remove("win"), 1000);
}

function updateHighestStreak(streak) {
  const currentHigh = parseInt(highestStreakParagraph.textContent || "0", 10) || 0;
  if (streak > currentHigh) {
    highestStreakParagraph.textContent = String(streak);
    localStorage.setItem("highestStreak", String(streak));
  }
}

function determineWinner(playerChoice, computerChoice) {
  if (playerChoice === computerChoice) {
    playSound("tie");
    // tie ends current streak
    updateHighestStreak(parseInt(winStreakSpan.textContent || "0", 10));
    winStreakSpan.textContent = "0";
    return "It's a tie!";
  }

  const playerWins =
    (playerChoice === "rock" && computerChoice === "scissors") ||
    (playerChoice === "paper" && computerChoice === "rock") ||
    (playerChoice === "scissors" && computerChoice === "paper");

  if (playerWins) {
    playerScore++;
    celebrateWin();
    playSound("win");
    const newStreak = (parseInt(winStreakSpan.textContent || "0", 10) || 0) + 1;
    winStreakSpan.textContent = String(newStreak);
    // update highest if necessary immediately (optional)
    updateHighestStreak(newStreak);
    return `You win! ${capitalize(playerChoice)} beats ${capitalize(computerChoice)}.`;
  }

  // computer wins
  computerScore++;
  playSound("lose");
  // loss ends streak
  updateHighestStreak(parseInt(winStreakSpan.textContent || "0", 10));
  winStreakSpan.textContent = "0";
  return `You lose! ${capitalize(computerChoice)} beats ${capitalize(playerChoice)}.`;
}

function updateScores() {
  playerScoreSpan.textContent = String(playerScore);
  computerScoreSpan.textContent = String(computerScore);
}

function playRound(playerChoice) {
  const difficulty = difficultySelect.value;
  const computerChoice = getComputerChoice(difficulty);

  playerChoiceDiv.textContent = `Player choice: ${capitalize(playerChoice)}`;
  computerChoiceDiv.textContent = `Computer choice: ${capitalize(computerChoice)}`;
  const resultMessage = determineWinner(playerChoice, computerChoice);
  outcomeDiv.textContent = resultMessage;

  updateScores();
  lastPlayerChoice = playerChoice;
}

function updateButtonsForTheme() {
  const theme = themeSelect.value;
  // set body class cleanly
  document.body.classList.remove("dark", "emoji", "meme");
  document.body.classList.add(theme);

  if (theme === "emoji") {
    rockButton.textContent = "🪨 Rock";
    paperButton.textContent = "📄 Paper";
    scissorsButton.textContent = "✂️ Scissors";
  } else if (theme === "meme") {
    rockButton.textContent = "Rock (Dwayne Johnson)";
    paperButton.textContent = "Paper (Paper Plane)";
    scissorsButton.textContent = "Scissors (Edward Scissorhands)";
  } else {
    rockButton.textContent = "Rock";
    paperButton.textContent = "Paper";
    scissorsButton.textContent = "Scissors";
  }
}

// Add data attributes for accessibility / keyboard handling
rockButton.setAttribute("data-choice", "rock");
paperButton.setAttribute("data-choice", "paper");
scissorsButton.setAttribute("data-choice", "scissors");

// Event listeners
rockButton.addEventListener("click", () => playRound("rock"));
paperButton.addEventListener("click", () => playRound("paper"));
scissorsButton.addEventListener("click", () => playRound("scissors"));

// Keyboard support: allow Enter/Space to trigger buttons when focused
[rockButton, paperButton, scissorsButton].forEach((btn) => {
  btn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      btn.click();
    }
  });
});

difficultySelect.addEventListener("change", () => {
  // Reset scores and last choice on difficulty change
  playerScore = 0;
  computerScore = 0;
  lastPlayerChoice = null;
  updateScores();
  playerChoiceDiv.textContent = "";
  computerChoiceDiv.textContent = "";
  outcomeDiv.textContent = "";
  winStreakSpan.textContent = "0";
});

themeSelect.addEventListener("change", updateButtonsForTheme);

// Initial setup
preloadSounds();
updateButtonsForTheme();
// ensure theme applied on load
document.body.classList.remove("dark", "emoji", "meme");
document.body.classList.add(themeSelect.value);