// constants
const COLORS = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)', 'rgb(0, 255, 0)', 'rgb(255, 255, 0)'];  // color options for player's guess & secret code
const CODE_LENGTH = 4;  // maximum length for secret code & player guesses
const MAX_GUESSES = 10;  // 10 tries to get it right!

// state variables
let guesses = 10; // keep track of player guesses and use to keep track of corresponding/current row; if this reaches 10 player loses
let randomCode = []; // variable that will hold computer-generated code for player to guess
let currentHoleIdx = 0; // index of hole in current row to be filled with clicked color
let gameOver = false;

// cached elements
const secretRow = document.getElementById('secret-row');
const guessRows = Array.from(document.querySelectorAll('.row'));
const colorOptions = Array.from(document.getElementById('player-choices').querySelectorAll('.hole'));
const checkGuessButton = document.getElementById('check-guess');
const clearGuessButton = document.getElementById('clear-guess');
const newGameButton = document.getElementById('new-game');
const message = document.getElementById('message');

// event listeners
newGameButton.addEventListener('click', init);
checkGuessButton.addEventListener('click', checkGuess);
clearGuessButton.addEventListener('click', clearGuess);
colorOptions.forEach((option, idx) => {
    option.addEventListener('click', renderGuess);
});

// functions

// get a random combination from computer by iterating over COLORS array
function getRandomCode() {
    const code = [];
    for (let i = 0; i < CODE_LENGTH; i++) {
        const rndIdx = Math.floor(Math.random() * COLORS.length);
        code.push(COLORS[rndIdx]);
    }
    return code;
}

// check player guess againt randomCode and award appropriate number of red/white pegs
function checkGuess() {
    if (gameOver) {
        return;
    }
    currentHoleIdx = 0;
    const currentRow = guessRows[guesses];
    const guessArray = Array.from(currentRow.querySelectorAll('.hole'));
    let redPegs = 0;
    let whitePegs = 0;
    let correctGuess = true;
    let codeCopy = [...randomCode];
    for (let i = 0; i < guessArray.length; i++) {
        const color = getComputedStyle(guessArray[i]).backgroundColor;
        if (color !== codeCopy[i]) {
          correctGuess = false;
        } else {
            redPegs++;
            codeCopy[i] = null;
        }
    }
    if (correctGuess === true) {
        win();
        return;
    }
    for(let i = 0; i < guessArray.length; i++) {
        const color = getComputedStyle(guessArray[i]).backgroundColor;
        if (color !== codeCopy[i] && codeCopy.includes(color)) {
            whitePegs++;
            codeCopy[codeCopy.indexOf(color)] = null;
        }
    }
    renderFeedback(redPegs, whitePegs, currentRow);
    guesses--;
    if(guesses === 0) {
        lose();
    } else {
        highlightRow(guesses);
    }
}

// function to initialize the game
function init() {
    gameOver = false;
    guesses = MAX_GUESSES;
    randomCode = getRandomCode();
    message.innerText = "Welcome to Mastermind! Try to guess the code!";
    currentHoleIdx = 0;
    // clear the board:
    guessRows.forEach((row) => {
        row.classList.remove('highlight');
        const holes = Array.from(row.querySelectorAll('.hole'));
        holes.forEach((hole) => {
            hole.style.backgroundColor = 'gray';
        });
        const fbHoles = Array.from(row.querySelectorAll('.fb-hole'));
        fbHoles.forEach((hole) => {
            hole.style.backgroundColor = 'gray';
        });
    });
    guessRows[guesses].classList.add('highlight');
}

function renderGuess(evt) {
    if (gameOver) {
        return;
    }
    const currentRow = guessRows[guesses];
    const clickedColor = getComputedStyle(evt.target).backgroundColor; // get clicked color
    const currentHole = currentRow.querySelectorAll('.hole')[currentHoleIdx];
    currentHole.style.backgroundColor = clickedColor;
    currentHoleIdx++;
    /* if(currentHoleIdx === CODE_LENGTH) {
        currentHoleIdx = 0;
    } */
}

function renderFeedback(redPegs, whitePegs, currentRow) {
    const fbHoles = Array.from(currentRow.querySelectorAll('.fb-hole')); // array to access/modify feedback in current row
    fbHoles.forEach((hole, idx) => { 
        if (idx < redPegs) {
            hole.style.backgroundColor = 'red';
        } else if (idx < redPegs + whitePegs) {
            hole.style.backgroundColor = 'white';
        } else {
            hole.style.backgroundColor = 'gray';
        }
    });
}

function revealCode() {
    const code = Array.from(secretRow.querySelectorAll('.hole'));
    for (let i = 0; i < CODE_LENGTH; i++) {
        const hole = code[i];
        hole.style.backgroundColor = randomCode[i];
        hole.textContent = '';
    }
}

function win() {
    message.innerText = 'Congrats! You win!'
    revealCode();
    gameOver = true;
}

function lose() {
    message.innerText = 'You lose! Better luck next time!';
    revealCode();
    gameOver = true;
}

function highlightRow(guesses) {
    const lastRow = guessRows[guesses +1]; 
    const currentRow = guessRows[guesses];
    lastRow.classList.remove('highlight');
    currentRow.classList.add('highlight');
}

function clearGuess() {
    currentHoleIdx = 0;
    const guess = Array.from(guessRows[guesses].querySelectorAll('.hole'));
    guess.forEach((hole) => {
        hole.style.backgroundColor = 'gray';
    });
}

init();