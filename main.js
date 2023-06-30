// constants
const COLORS = ['black', 'white', 'red', 'blue', 'green', 'yellow'];  // peg color options for player's guess
const CODE_LENGTH = 4;  // maximum length for secret code & player guesses
const MAX_GUESSES = 10;  // 10 tries to get it right!

// state variables
let guesses; // initilize to 0 in init function; keep track of player guesses; if this reaches 10 player loses
let randomCode; // variable that will hold computer-generated code for player to guess
let guessArray; // will hold values of player's current guess

// cached elements
const secretRow = document.getElementById('secret-row');
const playerChoiceRow = document.getElementById('player-choices');
const checkGuessButton = document.getElementById('check-guess');
const newGameButton = document.getElementById('new-game');

// event listeners
newGameButton.addEventListener('click', init);
checkGuessButton.addEventListener('click', checkGuess);

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
    let redPegs = 0;
    let whitePegs = 0;

    function checkRed() {
        // work out logic and implement code to check for/increment red pegs
    }

    function checkWhite() {
        // work out logic and implement code to check for/increment white pegs
    }
}

// function to initialize the game
function init() {
    guesses = 0;
    randomCode = getRandomCode();
    render();
}

function render() {
    renderBoard();
    renderFeedback();
}

function renderBoard() {
    
}

function renderFeedback() {

}

function getGuess() {
    
}

function displayMessage() {

}

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