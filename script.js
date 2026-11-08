/* =========================================
   ENHANCED MEMORY MATCH GAME
========================================= */


/* =========================================
   SCREENS
========================================= */

const homeScreen = document.getElementById("homeScreen");
const levelScreen = document.getElementById("levelScreen");
const gameScreen = document.getElementById("gameScreen");
const resultScreen = document.getElementById("resultScreen");

const screens = [
    homeScreen,
    levelScreen,
    gameScreen,
    resultScreen
];


/* =========================================
   BUTTONS
========================================= */

const playBtn = document.getElementById("playBtn");
const backHomeBtn = document.getElementById("backHomeBtn");
const quitBtn = document.getElementById("quitBtn");
const playAgainBtn = document.getElementById("playAgainBtn");
const menuBtn = document.getElementById("menuBtn");

const levelButtons = document.querySelectorAll(".level-btn");


/* =========================================
   GAME DISPLAY
========================================= */

const livesDisplay = document.getElementById("livesDisplay");
const scoreDisplay = document.getElementById("scoreDisplay");
const comboDisplay = document.getElementById("comboDisplay");

const currentLevel = document.getElementById("currentLevel");
const gameMessage = document.getElementById("gameMessage");

const memoryBoard = document.getElementById("memoryBoard");


/* =========================================
   RESULT DISPLAY
========================================= */

const resultIcon = document.getElementById("resultIcon");
const resultTitle = document.getElementById("resultTitle");
const starsDisplay = document.getElementById("starsDisplay");
const resultMessage = document.getElementById("resultMessage");

const finalScore = document.getElementById("finalScore");
const bestScore = document.getElementById("bestScore");

const confettiContainer =
    document.getElementById("confettiContainer");


/* =========================================
   GAME SETTINGS
========================================= */

const levels = {

    easy: {
        pairs: 4,
        lives: 10,
        name: "EASY MODE"
    },

    medium: {
        pairs: 8,
        lives: 10,
        name: "MEDIUM MODE"
    },

    hard: {
        pairs: 15,
        lives: 10,
        name: "HARD MODE"
    }

};


/* =========================================
   GAME STATE
========================================= */

let selectedLevel = "easy";

let lives = 0;
let startingLives = 0;

let score = 0;
let combo = 0;

let flippedCards = [];
let matchedPairs = 0;

let boardLocked = false;


/* =========================================
   PROGRESS SYSTEM
========================================= */

let unlockedLevel =
    localStorage.getItem("memoryMatchUnlocked") ||
    "easy";


function saveUnlockedLevel(level) {

    localStorage.setItem(
        "memoryMatchUnlocked",
        level
    );

    unlockedLevel = level;

}


function updateLevelButtons() {

    const levelOrder = [
        "easy",
        "medium",
        "hard"
    ];

    const unlockedIndex =
        levelOrder.indexOf(unlockedLevel);

    levelButtons.forEach(button => {

        const buttonLevel =
            button.dataset.level;

        const buttonIndex =
            levelOrder.indexOf(buttonLevel);

        button.disabled =
            buttonIndex > unlockedIndex;

    });

}


/* =========================================
   BEST SCORE
========================================= */

function getBestScore(level) {

    return Number(
        localStorage.getItem(
            "memoryBest_" + level
        )
    ) || 0;

}


function saveBestScore(level, newScore) {

    const oldBest =
        getBestScore(level);

    if (newScore > oldBest) {

        localStorage.setItem(
            "memoryBest_" + level,
            newScore
        );

        return newScore;

    }

    return oldBest;

}


/* =========================================
   SCREEN SYSTEM
========================================= */

function showScreen(screen) {

    screens.forEach(item => {
        item.classList.add("hidden");
    });

    screen.classList.remove("hidden");

}


/* =========================================
   NAVIGATION
========================================= */

playBtn.addEventListener("click", () => {

    updateLevelButtons();

    showScreen(levelScreen);

});


backHomeBtn.addEventListener("click", () => {

    showScreen(homeScreen);

});


quitBtn.addEventListener("click", () => {

    if (
        confirm(
            "Are you sure you want to quit this game?"
        )
    ) {

        showScreen(homeScreen);

    }

});


menuBtn.addEventListener("click", () => {

    showScreen(homeScreen);

});


/* =========================================
   LEVEL SELECTION
========================================= */

levelButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.disabled) return;

        selectedLevel =
            button.dataset.level;

        startGame();

    });

});


/* =========================================
   START GAME
========================================= */

function startGame() {

    const settings =
        levels[selectedLevel];

    lives =
        settings.lives;

    startingLives =
        settings.lives;

    score = 0;
    combo = 0;

    flippedCards = [];
    matchedPairs = 0;

    boardLocked = false;

    currentLevel.textContent =
        settings.name;

    gameMessage.textContent =
        "Find all " +
        settings.pairs +
        " matching pairs! 💗";

    updateHud();

    createBoard();

    showScreen(gameScreen);

}


/* =========================================
   HUD
========================================= */

function updateHud() {

    livesDisplay.textContent =
        "❤️".repeat(lives);

    scoreDisplay.textContent =
        "⭐ " + score;

    comboDisplay.textContent =
        "🔥 x" + combo;

}


/* =========================================
   CARD SYMBOLS
========================================= */

const symbols = [

    "🐱", "💗", "🌸", "🎀",
    "🦄", "🍓", "🧁", "🌈",
    "🐰", "⭐", "🍭", "🦋",
    "🌙", "🍒", "🐻", "🧸",
    "🐼", "🐸", "🍩", "🍪",
    "🌼", "💎", "🎮", "🎧"

];


/* =========================================
   CREATE BOARD
========================================= */

function createBoard() {

    memoryBoard.innerHTML = "";

    const pairCount =
        levels[selectedLevel].pairs;

    const selectedSymbols =
        symbols.slice(0, pairCount);

    const cards = shuffle([
        ...selectedSymbols,
        ...selectedSymbols
    ]);


    /* GRID SIZE */

    if (pairCount === 4) {

        memoryBoard.style.gridTemplateColumns =
            "repeat(4, 1fr)";

    }

    else if (pairCount === 8) {

        memoryBoard.style.gridTemplateColumns =
            "repeat(4, 1fr)";

    }

    else if (pairCount === 15) {

        memoryBoard.style.gridTemplateColumns =
            "repeat(6, 1fr)";

    }


    /* CREATE CARDS */

    cards.forEach(symbol => {

        const card =
            document.createElement("button");

        card.className =
            "memory-card";

        card.dataset.symbol =
            symbol;

        card.innerHTML = `
      <div class="card-inner">

        <div class="card-front"></div>

        <div class="card-back">
          ${symbol}
        </div>

      </div>
    `;

        card.addEventListener(
            "click",
            () => flipCard(card)
        );

        memoryBoard.appendChild(card);

    });

}


/* =========================================
   SHUFFLE
========================================= */

function shuffle(array) {

    return array.sort(
        () => Math.random() - 0.5
    );

}


/* =========================================
   FLIP CARD
========================================= */

function flipCard(card) {

    if (
        boardLocked ||
        card.classList.contains("flipped") ||
        card.classList.contains("matched")
    ) {
        return;
    }

    card.classList.add("flipped");

    flippedCards.push(card);


    if (flippedCards.length === 2) {

        boardLocked = true;

        setTimeout(
            checkMatch,
            500
        );

    }

}


/* =========================================
   CHECK MATCH
========================================= */

function checkMatch() {

    const first =
        flippedCards[0];

    const second =
        flippedCards[1];


    /* CORRECT MATCH */

    if (
        first.dataset.symbol ===
        second.dataset.symbol
    ) {

        first.classList.remove("flipped");
        second.classList.remove("flipped");

        first.classList.add("matched");
        second.classList.add("matched");

        matchedPairs++;

        combo++;

        const points =
            10 + (combo * 5);

        score += points;

        gameMessage.textContent =
            "✨ MATCH! +" +
            points +
            " points!";


        comboDisplay.classList.add(
            "combo-pop"
        );

        setTimeout(() => {

            comboDisplay.classList.remove(
                "combo-pop"
            );

        }, 500);


        updateHud();


        /* ALL PAIRS MATCHED */

        if (
            matchedPairs ===
            levels[selectedLevel].pairs
        ) {

            setTimeout(() => {

                endGame(true);

            }, 700);

            return;

        }


        flippedCards = [];

        boardLocked = false;

    }


    /* WRONG MATCH */

    else {

        first.classList.add("wrong");
        second.classList.add("wrong");

        lives--;

        combo = 0;

        gameMessage.textContent =
            "💔 Wrong match! Try again!";


        updateHud();


        setTimeout(() => {

            first.classList.remove(
                "flipped",
                "wrong"
            );

            second.classList.remove(
                "flipped",
                "wrong"
            );

            flippedCards = [];

            if (lives <= 0) {

                endGame(false);

            } else {

                boardLocked = false;

            }

        }, 700);

    }

}


/* =========================================
   END GAME
========================================= */

function endGame(won) {

    boardLocked = true;

    showScreen(resultScreen);

    if (won) {

        showWinResult();

    } else {

        showLoseResult();

    }

}


/* =========================================
   WIN RESULT
========================================= */

function showWinResult() {

    let starCount = 1;

    if (lives === startingLives) {

        starCount = 3;

    } else if (
        lives >= Math.ceil(startingLives / 2)
    ) {

        starCount = 2;

    }


    resultIcon.textContent = "🏆";

    resultTitle.textContent =
        "LEVEL COMPLETE!";

    starsDisplay.textContent =
        "⭐".repeat(starCount);

    resultMessage.textContent =
        "Amazing! You completed " +
        levels[selectedLevel].name +
        "! 💗";


    const newBest =
        saveBestScore(
            selectedLevel,
            score
        );

    finalScore.textContent = score;

    bestScore.textContent = newBest;


    unlockNextLevel();

    createConfetti();

}


/* =========================================
   LOSE RESULT
========================================= */

function showLoseResult() {

    resultIcon.textContent = "💔";

    resultTitle.textContent =
        "GAME OVER";

    starsDisplay.textContent =
        "☆ ☆ ☆";

    resultMessage.textContent =
        "Don't give up! Try again! 🐱💗";

    finalScore.textContent = score;

    bestScore.textContent =
        getBestScore(selectedLevel);

}


/* =========================================
   UNLOCK NEXT LEVEL
========================================= */

function unlockNextLevel() {

    if (
        selectedLevel === "easy" &&
        unlockedLevel === "easy"
    ) {

        saveUnlockedLevel("medium");

    }

    else if (
        selectedLevel === "medium" &&
        unlockedLevel === "medium"
    ) {

        saveUnlockedLevel("hard");

    }

}


/* =========================================
   PLAY AGAIN
========================================= */

playAgainBtn.addEventListener("click", () => {

    startGame();

});


/* =========================================
   CONFETTI
========================================= */

function createConfetti() {

    confettiContainer.innerHTML = "";

    const confettiSymbols = [
        "💗",
        "✨",
        "🎀",
        "⭐",
        "🌸"
    ];

    for (let i = 0; i < 45; i++) {

        const piece =
            document.createElement("div");

        piece.classList.add("confetti");

        piece.textContent =
            confettiSymbols[
            Math.floor(
                Math.random() *
                confettiSymbols.length
            )
            ];

        piece.style.left =
            Math.random() * 100 + "vw";

        piece.style.animationDelay =
            Math.random() * 0.8 + "s";

        piece.style.fontSize =
            Math.random() * 15 + 15 + "px";

        confettiContainer.appendChild(piece);

    }

    setTimeout(() => {

        confettiContainer.innerHTML = "";

    }, 4000);

}


/* =========================================
   START APP
========================================= */

updateLevelButtons();

showScreen(homeScreen);