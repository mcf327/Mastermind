// constants
const COLORS = ['rgb(0, 0, 0)', 'rgb(255, 255, 255)', 'rgb(255, 0, 0)', 'rgb(0, 0, 255)', 'rgb(0, 255, 0)', 'rgb(255, 255, 0)'];  // color options for player's guess & secret code
const CODE_LENGTH = 4;  // maximum length for secret code & player guesses
const MAX_GUESSES = 10;  // 10 tries to get it right!

// state variables
let guesses = 10; // keep track of player guesses and use to keep track of corresponding/current row; if this reaches 0 player loses
let randomCode = []; // variable that will hold computer-generated code for player to guess
let currentHoleIdx = 0; // index of hole in current row to be filled with clicked color
let gameOver = false; // variable to keep track of whether or not game is over; will be set to true if player wins/loses to stop input

// cached elements
const secretRow = document.getElementById('secret-row'); // variable to access row for random code
const guessRows = Array.from(document.querySelectorAll('.row')); // array to access each row on the board for current guess - using "guesses" state variable as index
const colorOptions = Array.from(document.getElementById('player-choices').querySelectorAll('.hole')); // access the 6 colors in bottom row as an array
const checkGuessButton = document.getElementById('check-guess'); 
const clearGuessButton = document.getElementById('clear-guess'); // variables for accessing buttons and message box at top
const newGameButton = document.getElementById('new-game');
const messageBox = document.getElementById('message');

// event listeners for buttons and color options
newGameButton.addEventListener('click', init);
checkGuessButton.addEventListener('click', checkGuess); 
clearGuessButton.addEventListener('click', clearGuess);
colorOptions.forEach((option, idx) => {
    option.addEventListener('click', renderGuess); // use a foreach loop to add event listeners to color options instead of assigning one by one
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
    if (gameOver) {  // statement to return if game is over; stop receiving input until new game is clicked
        return;
    }
    currentHoleIdx = 0;
    const currentRow = guessRows[guesses]; // navigate to the row corresponding to current guess, starting with the bottom
    const guessArray = Array.from(currentRow.querySelectorAll('.hole')); // get array representing current guess from clicked colors in current row
    let redPegs = 0; // variables to track red and white pegs to be rendered for feedbacK
    let whitePegs = 0;
    let codeCopy = [...randomCode]; // create a copy of the randomly generated code for easier manipulation and tracking of red/white pegs
    const unmatchedGuess = [];
    // loop through guess array, compare each element to corresponding element in randomCode; increment redPegs if there's a match
    for (let i = 0; i < guessArray.length; i++) {
        const color = getComputedStyle(guessArray[i]).backgroundColor;  
        if (color === codeCopy[i]) { 
            redPegs++;
            codeCopy[i] = null; // set value at index i in the copy of the random code to null, so that it's not counted more than once when checking for white pegs
        } else {
            unmatchedGuess.push(color);
        }
    }
    for(let i = 0; i < unmatchedGuess.length; i++) {   
        const colorIdx = codeCopy.indexOf(unmatchedGuess[i]); 
        if (colorIdx !== -1) {
            whitePegs++;
            codeCopy[colorIdx] = null; // again, set value at index i to null so it can't be counted more than once
        }
    }
    renderFeedback(redPegs, whitePegs, currentRow); // call renderFeedback function to render appropriate number of red and white pegs for the current row
    if (redPegs === CODE_LENGTH){
        displayWin();
        gameOver = true;
        return;
    }
    guesses--;
    if(guesses === 0) {
        displayLose();  // if the player has used up all guesses, display losing message and end game
        gameOver = true;
    } else {
        highlightRow(guesses); // highlight the next row visually so player knows to input next guess
    }
}

// function to initialize the game
function init() {
    gameOver = false;
    guesses = MAX_GUESSES;
    randomCode = getRandomCode(); // call function to generate a random code when game is started
    messageBox.innerText = "Welcome to Mastermind! Try to guess the code!";
    currentHoleIdx = 0;
    // clear the board: loop through all rows, remove active class to remove colors from holes
    guessRows.forEach((row) => {
        row.classList.remove('highlight');
        const holes = Array.from(row.querySelectorAll('.hole'));
        holes.forEach((hole) => {
            hole.classList.remove('active');
            hole.style.backgroundColor = 'gray';
        });
        const fbHoles = Array.from(row.querySelectorAll('.fb-hole'));  // also set background color of feedback holes in each row to gray
        fbHoles.forEach((hole) => {
            hole.classList.remove('active');
            hole.style.backgroundColor = 'gray';
        });
    });
    secretRow.querySelectorAll('.hole').forEach((hole) => {
        hole.textContent = '?';
    });
    guessRows[guesses].classList.add('highlight'); // highlight starting row according to value of 'guesses'
}

// function to map clicked color to the current row for player's guess 
function renderGuess(evt) {
    if (gameOver) { // don't execute if the game has already been won or lost
        return;
    }
    const currentRow = guessRows[guesses];
    const clickedColor = getComputedStyle(evt.target).backgroundColor; // get clicked color
    const currentHole = currentRow.querySelectorAll('.hole')[currentHoleIdx]; // variable to access each hole in current row
    currentHole.style.backgroundColor = clickedColor; // set background color of hole to the clicked color
    currentHole.classList.add('active');
    currentHoleIdx++;
}

function renderFeedback(redPegs, whitePegs, currentRow) {
    const fbHoles = Array.from(currentRow.querySelectorAll('.fb-hole')); // array to access/modify feedback in current row
    fbHoles.forEach((hole, idx) => { 
        if (idx < redPegs) {
            hole.classList.add('active');
            hole.style.backgroundColor = 'red';
        } else if (idx < redPegs + whitePegs) {
            hole.classList.add('active')
            hole.style.backgroundColor = 'white';
        } else {
            hole.style.backgroundColor = 'gray';
        }
    });
}
// function to replace the top "????" row with colors corresponding to randomCode array
function revealCode() {
    const code = Array.from(secretRow.querySelectorAll('.hole')); // variable to access row for secret code
    for (let i = 0; i < CODE_LENGTH; i++) {
        const hole = code[i]; // access each hole in loop
        hole.classList.add('active');
        hole.style.backgroundColor = randomCode[i]; // set background color of each hole to corresponding color in randomCode
        hole.textContent = ''; // remove question marks
    }
}
// display winning message and reveal secret code
function displayWin() {
    messageBox.innerText = 'Congrats! You win!'
    revealCode();
}
// display losing message and reveal secret code
function displayLose() {
    messageBox.innerText = 'You lose! Better luck next time!';
    revealCode();
}

// function to add a class to highlight the current row visually and remove the class from the previous row
function highlightRow(guesses) {
    const lastRow = guessRows[guesses +1]; 
    const currentRow = guessRows[guesses];
    lastRow.classList.remove('highlight');
    currentRow.classList.add('highlight');
}

// function to start current guess over when "clear guess" is clicked
function clearGuess() {
    if (gameOver) {
        return; // don't execute if game is already over
    }
    currentHoleIdx = 0;
    const guess = Array.from(guessRows[guesses].querySelectorAll('.hole'));
    guess.forEach((hole) => {
        hole.classList.remove('active');
        hole.style.backgroundColor = 'gray';
    });
}

init(); // call init function when game loads