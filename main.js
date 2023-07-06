// constants
const COLORS = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)', 'rgb(0, 255, 0)', 'rgb(255, 255, 0)'];  // color options for player's guess & secret code
const CODE_LENGTH = 4;  // maximum length for secret code & player guesses
const MAX_GUESSES = 10;  // 10 tries to get it right!

// state variables
let guesses = 10; // keep track of player guesses and use to keep track of corresponding/current row; if this reaches 10 player loses
let randomCode = []; // variable that will hold computer-generated code for player to guess
let currentHoleIdx = 0; // index of hole in current row to be filled with clicked color

// cached elements
const secretRow = document.getElementById('secret-row');
const guessRows = Array.from(document.querySelectorAll('.row'));
const colorOptions = Array.from(document.getElementById('player-choices').querySelectorAll('.hole'));
const checkGuessButton = document.getElementById('check-guess');
const newGameButton = document.getElementById('new-game');

// event listeners
newGameButton.addEventListener('click', init);
checkGuessButton.addEventListener('click', checkGuess);
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
    const currentRow = guessRows[guesses];
    const guessArray = Array.from(currentRow.querySelectorAll('.hole'));
    let redPegs = 0;
    let whitePegs = 0;
    let correctGuess = true;
    for (let i = 0; i < guessArray.length; i++) {
        const color = getComputedStyle(guessArray[i]).backgroundColor;
        if (color !== randomCode[i]) {
          correctGuess = false;
        } else {
            redPegs++;
        }
    }

    if (correctGuess === true) {
        displayWin();
        return;
    }

    for(let i = 0; i < guessArray.length; i++) {
        const color = getComputedStyle(guessArray[i]).backgroundColor;
        for (let j = 0; j < guessArray.length; j++) {
            if (color === randomCode[j] && i !== j) {
                whitePegs++;
                break;
            }
        }
    }

    renderFeedback(redPegs, whitePegs, currentRow);
    guesses--;
    if(guesses === 0) {
        displayLose();
    }
}

// function to initialize the game
function init() {
    guesses = 10;
    randomCode = getRandomCode();
    //clear the board:
    guessRows.forEach((row) => {
        const holes = Array.from(row.querySelectorAll('.hole'));
        holes.forEach((hole) => {
            hole.style.backgroundColor = 'gray';
        });
        const fbHoles = Array.from(row.querySelectorAll('.fb-hole'));
        fbHoles.forEach((hole) => {
            hole.style.backgroundColor = 'gray';
        });
    });
}

function renderGuess(evt) {
    const currentRow = guessRows[guesses];
    const clickedColor = getComputedStyle(evt.target).backgroundColor; // get clicked color
    const currentHole = currentRow.querySelectorAll('.hole')[currentHoleIdx];
    currentHole.style.backgroundColor = clickedColor;
    currentHoleIdx++;
    if(currentHoleIdx === CODE_LENGTH) {
        currentHoleIdx = 0;
    }
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

function displayWin() {
    const msg = document.getElementById('message');
    msg.innerText = 'Congrats! You win!'
}

function displayLose() {
    const msg = document.getElementById('message');
    msg.innerText = 'You lose! Better luck next time!';
}

init();

/* // constants 
- colors array for six possible player color choices
- codeLength = 4
- maxGuesses = 10
-function randomCode() to generate the random code for player to guess. Iterate over colors array for i < codeLength, choose random color and push it to new array, return the new array.
-function checkGuess() to check player’s guess. Inside this function declare two variables (redPegs, whitePegs) to keep track of how many red/white “feedback” pegs will be awarded for the guess. Should have two nested functions:
        -function checkRed() to check for red pegs (correct color/correct position). Compare  random code array to array for player’s current guess. If guess array[i] === random array [i], increment red pegs +1.
        -function checkWhite() to check for white pegs (correct color/wrong position). If correct color/wrong position found, increment white pegs +1. // Still have to come back and work out the rest of the logic here
return redPegs, whitePegs
-function init() that will set guess to 0 and call a function renderBoard() to display new game board
-function renderBoard() to display game board with previous/current guesses
-function renderFeedback() to display feedback pegs in right hand column
-function getGuess() - get user input and assign to guessArray
-function displayWinLose() to display a winning message if player guesses correctly or a losing message if guess > maxGuesses
-event listeners for buttons and user input - try to implement drag and drop for player guess
—-------------------------------------
let guesses = 0;
let guessArray; // array for player guess 
while guesses < maxGuesses
        renderBoard()
        guessArray = getGuess()
        checkGuess(guessArray, randomCode)
        If guessArray === randomCode, display message and break while loop - player wins
If guesses === maxGuesses, display message and break loop - player loses
guesses++
init(); */