// Birthday countdown timer
function getNextBirthdayDate() {
    const now = new Date();
    const thisYear = now.getFullYear();
    let nextBirthday = new Date(`June 11, ${thisYear} 00:00:00`);
    // If today is June 12 or later, use next year
    if (now > new Date(`June 11, ${thisYear} 23:59:59`)) {
        nextBirthday = new Date(`June 11, ${thisYear + 1} 00:00:00`);
    }
    return nextBirthday;
}
let countdownDate = getNextBirthdayDate().getTime();

function triggerConfetti() {
    if (window.confetti) window.confetti();
}

function updateCountdown() {
    const now = new Date().getTime();
    let distance = countdownDate - now;

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Display the result
    document.getElementById('days').innerText = days.toString().padStart(2, '0');
    document.getElementById('hours').innerText = hours.toString().padStart(2, '0');
    document.getElementById('minutes').innerText = minutes.toString().padStart(2, '0');
    document.getElementById('seconds').innerText = seconds.toString().padStart(2, '0');

    // If the countdown is over
    if (distance < 0) {
        // Show birthday message and confetti
        const countdownContainer = document.querySelector('.countdown-container');
        const birthdayMessage = document.createElement('div');
        birthdayMessage.classList.add('birthday-message');
        birthdayMessage.innerHTML = '<h2>Happy Birthday Adi! 🎉🎂</h2>';
        countdownContainer.appendChild(birthdayMessage);
        triggerConfetti();
        // Set countdown for next year
        countdownDate = getNextBirthdayDate().getTime();
    }
}

// Update the countdown every second
setInterval(updateCountdown, 1000);

// Initial call to set the values immediately
updateCountdown();

// Game Navigation
const gameButtons = document.querySelectorAll('.game-btn');
const gameContents = document.querySelectorAll('.game-content');

gameButtons.forEach(button => {
    button.addEventListener('click', () => {
        const gameId = button.getAttribute('data-game');
        
        // Remove active class from all buttons and contents
        gameButtons.forEach(btn => btn.classList.remove('active'));
        gameContents.forEach(content => content.classList.remove('active'));
        
        // Add active class to selected button and content
        button.classList.add('active');
        document.getElementById(`${gameId}-game`).classList.add('active');
    });
});

// WORDLE GAME
const WORDS = [
    'REACT', 'LOGIC', 'MODEL', 'BRAIN', // Tech & Skills
    'CHOCO', 'SNACC', 'CROCS', 'PIZZA', // Foodie & Quirky
    'JOKER', 'RIFFS', 'THALA', 'PEAKS', 'POPLI', // Fun & Hobbies
    'CURIO', 'SUNNY', 'BUILD', 'CRAFT', 'ALIVE', // Personality & Vibes
    'BLOCK', 'MOTTO', 'VIVAS', 'MUTE', 'BLOCK', 'CAPES', 'CHASH', 'GYMYM', 'EIGHT', 'VIBES', 'SMILE', 'LUCKY', 'PUPPY', 'GUESS', 'BULKY', 'THUMP', 'BINGE', 'BLURR', 'BUMPY', 'TUNES', 'ROAST', 'MEMES', 'WAIST', 'THALA', 'POPLI', 'ADIYA', 'ADIYO', 'BRAIN', 'CANDY', 'SWEET', 'PEAKY', 'SUNNY', 'BINGE', 'SNACK', 'TOAST', 'BEACH', 'BALII', 'UKULE', 'CODES', 'BUILD', 'CRAFT', 'ALIVE'
];

let WORDLE_VALID_WORDS = null; // Set after loading wordlist.txt

// Load wordlist.txt for valid guesses
fetch('wordlist.txt')
    .then(res => res.text())
    .then(text => {
        WORDLE_VALID_WORDS = new Set(text.split('\n').map(w => w.trim().toUpperCase()).filter(w => w.length === 5));
    });

let targetWord = '';
let currentRow = 0;
let currentCell = 0;
let gameActive = false;
let wordleInitialized = false;

function initWordle() {
    if (wordleInitialized) return;

    // Create the grid
    const wordleGrid = document.querySelector('.wordle-grid');
    wordleGrid.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.classList.add('wordle-row');
        
        for (let j = 0; j < 5; j++) {
            const cell = document.createElement('div');
            cell.classList.add('wordle-cell');
            row.appendChild(cell);
        }
        
        wordleGrid.appendChild(row);
    }

    // Create the keyboard
    const keyboard = document.querySelector('.keyboard');
    keyboard.innerHTML = '';

    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
    ];

    rows.forEach((row, rowIndex) => {
        const keyboardRow = document.createElement('div');
        keyboardRow.classList.add('keyboard-row');
        
        row.forEach(key => {
            const keyElement = document.createElement('div');
            keyElement.classList.add('key');
            if (key === 'ENTER' || key === '⌫') {
                keyElement.classList.add('wide');
            }
            keyElement.textContent = key;
            keyElement.addEventListener('click', () => handleKeyClick(key));
            keyboardRow.appendChild(keyElement);
        });
        
        keyboard.appendChild(keyboardRow);
    });

    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyPress);
    
    wordleInitialized = true;
    startNewWordleGame();
}

function startNewWordleGame() {
    currentRow = 0;
    currentCell = 0;
    gameActive = true;
    
    // Clear the grid
    const cells = document.querySelectorAll('.wordle-cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.className = 'wordle-cell';
    });
    
    // Reset keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        key.className = key.textContent === 'ENTER' || key.textContent === '⌫' ? 'key wide' : 'key';
    });
    
    // Choose a random word
    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    console.log('Target word:', targetWord);
    
    hideMessage();
}

function handleKeyPress(e) {
    if (!gameActive) return;
    
    if (e.key === 'Enter') {
        submitGuess();
    } else if (e.key === 'Backspace' || e.key === 'Delete') {
        deleteLetter();
    } else if (/^[a-zA-Z]$/.test(e.key)) {
        addLetter(e.key.toUpperCase());
    }
}

function handleKeyClick(key) {
    if (!gameActive) return;
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫') {
        deleteLetter();
    } else {
        addLetter(key);
    }
}

function addLetter(letter) {
    if (currentCell < 5) {
        const rows = document.querySelectorAll('.wordle-row');
        const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
        currentCells[currentCell].textContent = letter;
        currentCells[currentCell].classList.add('filled');
        currentCell++;
    }
}

function deleteLetter() {
    if (currentCell > 0) {
        currentCell--;
        const rows = document.querySelectorAll('.wordle-row');
        const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
        currentCells[currentCell].textContent = '';
        currentCells[currentCell].classList.remove('filled');
    }
}

function submitGuess() {
    if (currentCell !== 5) {
        showMessage('Not enough letters');
        return;
    }
    
    const rows = document.querySelectorAll('.wordle-row');
    const currentCells = rows[currentRow].querySelectorAll('.wordle-cell');
    
    let guess = '';
    currentCells.forEach(cell => {
        guess += cell.textContent;
    });
    
    // Check if the guess is a valid word
    if (
        (WORDLE_VALID_WORDS && !WORDLE_VALID_WORDS.has(guess)) &&
        !WORDS.includes(guess)
    ) {
        showMessage('Not in word list');
        shakeRow(currentRow);
        return;
    }
    
    // Check the guess
    const result = checkGuess(guess, targetWord);
    
    // Animate and update the UI based on the result
    animateReveal(currentCells, result, guess);
    
    // Check if the player won
    if (guess === targetWord) {
        gameActive = false;
        triggerConfetti();
        setTimeout(() => {
            showMessage('Excellent!');
            setTimeout(() => {
                if (confirm('Congratulations! You guessed the word! Play again?')) {
                    startNewWordleGame();
                }
            }, 1500);
        }, 2000);
        return;
    }
    
    // Move to the next row
    currentRow++;
    currentCell = 0;
    
    // Check if the player lost
    if (currentRow >= 6) {
        gameActive = false;
        setTimeout(() => {
            showMessage(`The word was ${targetWord}`);
            setTimeout(() => {
                if (confirm(`Game over! The word was ${targetWord}. Play again?`)) {
                    startNewWordleGame();
                }
            }, 2000);
        }, 2000);
    }
}

function animateReveal(cells, result, guess) {
    cells.forEach((cell, index) => {
        setTimeout(() => {
            cell.classList.add(result[index]);
            
            // Update keyboard
            const keyElement = findKeyByText(guess[index]);
            if (keyElement) {
                if (result[index] === 'correct') {
                    keyElement.classList.remove('present', 'absent');
                    keyElement.classList.add('correct');
                } else if (result[index] === 'present' && !keyElement.classList.contains('correct')) {
                    keyElement.classList.remove('absent');
                    keyElement.classList.add('present');
                } else if (result[index] === 'absent' && !keyElement.classList.contains('correct') && !keyElement.classList.contains('present')) {
                    keyElement.classList.add('absent');
                }
            }
        }, index * 100);
    });
}

function shakeRow(rowIndex) {
    const row = document.querySelectorAll('.wordle-row')[rowIndex];
    row.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        row.style.animation = '';
    }, 500);
}

function checkGuess(guess, target) {
    const result = Array(5).fill('absent');
    const targetLetters = target.split('');
    
    // First pass: check for correct letters in correct positions
    for (let i = 0; i < 5; i++) {
        if (guess[i] === target[i]) {
            result[i] = 'correct';
            targetLetters[i] = null; // Mark as used
        }
    }
    
    // Second pass: check for correct letters in wrong positions
    for (let i = 0; i < 5; i++) {
        if (result[i] === 'absent') {
            const index = targetLetters.indexOf(guess[i]);
            if (index !== -1) {
                result[i] = 'present';
                targetLetters[index] = null; // Mark as used
            }
        }
    }
    
    return result;
}

function findKeyByText(text) {
    const keys = document.querySelectorAll('.key');
    for (const key of keys) {
        if (key.textContent === text) {
            return key;
        }
    }
    return null;
}

function showMessage(text) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.classList.add('show');
    setTimeout(() => {
        messageEl.classList.remove('show');
    }, 2000);
}

function hideMessage() {
    const messageEl = document.getElementById('message');
    messageEl.classList.remove('show');
}

// Add shake animation
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
        20%, 40%, 60%, 80% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', initWordle);



let connectionsInitialized = false;
let selectedTiles = [];
let foundGroups = [];
let shuffledWords = [];
let mistakeCount = 0;
const MAX_MISTAKES = 4;

// --- Connections Sets ---
const CONNECTIONS_SETS = [
    // SET 1
    [
        { name: 'Footwear Energy', words: ['Crocs', 'Chash', 'Cap', 'Shorts'] },
        { name: 'Breakup Survival Kit', words: ['Choco', 'Uke', 'Mute', 'Block'] },
        { name: 'RCB Fan Starter Pack', words: ['RCB', 'Lose', 'Hope', 'Thala'] },
        { name: 'College Life Escapes', words: ['Viva', 'Gymy', 'Eight', 'Popli'] }
    ],
    // SET 2
    [
        { name: 'Music + Drama', words: ['Uke', 'Riffs', 'Joker', 'Tune'] },
        { name: 'Travel & Dream Life', words: ['Bali', 'Peaks', 'Sunny', 'Beach'] },
        { name: 'Foodie Core', words: ['Pizza', 'Choco', 'Snacc', 'Toast'] },
        { name: 'Code + Build Life', words: ['React', 'Brain', 'Logic', 'Build'] }
    ],
    // SET 3
    [
        { name: 'Nicknames / Identity', words: ['Adi', 'Popli', 'Thala', 'Coder'] },
        { name: 'Things He Can’t Live Without', words: ['Chash', 'Crocs', 'Choco', 'Vibe'] },
        { name: 'College Pain Points', words: ['Viva', 'Break', 'RCB', 'Eight'] },
        { name: 'Fitness but Make It Funny', words: ['Gymy', 'Motu', 'Bulk', 'Fail'] }
    ],
    // SET 4
    [
        { name: 'Adi’s Aesthetic', words: ['Vibe', 'Sunny', 'Choco', 'Uke'] },
        { name: 'Pain is Real', words: ['Break', 'Eight', 'Mute', 'RCB'] },
        { name: 'Web Dev Life', words: ['React', 'Build', 'Logic', 'Brain'] },
        { name: 'Silly but True', words: ['Popli', 'Joker', 'Crocs', 'Puppy'] }
    ],
    // SET 5
    [
        { name: 'Life Without Chashma', words: ['Chash', 'Blur', 'Lost', 'Bump'] },
        { name: 'Viva Bypass Moves', words: ['Smile', 'Puppy', 'Luck', 'Guess'] },
        { name: 'RCB Pain Dictionary', words: ['RCB', 'Wait', 'Yearn', 'Hope'] },
        { name: 'Mental Reset Kit', words: ['Peaks', 'Beach', 'Choco', 'Gymy'] }
    ]
];
let currentConnectionsSetIndex = 0;
let CONNECTIONS_GROUPS = CONNECTIONS_SETS[currentConnectionsSetIndex];

function nextConnectionsSet() {
    currentConnectionsSetIndex = (currentConnectionsSetIndex + 1) % CONNECTIONS_SETS.length;
    CONNECTIONS_GROUPS = CONNECTIONS_SETS[currentConnectionsSetIndex];
}

function initConnections() {
    if (connectionsInitialized) {
        resetConnectionsGame();
        return;
    }

    const connectionsGrid = document.querySelector('.connections-grid');
    connectionsGrid.innerHTML = '';

    // Reset game state
    selectedTiles = [];
    foundGroups = [];
    mistakeCount = 0;

    // Create a flat array of all words
    const allWords = CONNECTIONS_GROUPS.flatMap(group => group.words);
    shuffledWords = shuffleArray([...allWords]);

    shuffledWords.forEach(word => {
        const tile = document.createElement('div');
        tile.classList.add('connections-tile');
        tile.textContent = word;
        tile.addEventListener('click', () => handleTileClick(tile));
        connectionsGrid.appendChild(tile);
    });

    document.querySelector('.connections-groups').innerHTML = '';
    updateMistakeDisplay();
    connectionsInitialized = true;
}

function resetConnectionsGame() {
    // Move to next set
    nextConnectionsSet();
    selectedTiles = [];
    foundGroups = [];
    mistakeCount = 0;

    const tiles = document.querySelectorAll('.connections-tile');
    tiles.forEach(tile => {
        tile.className = 'connections-tile';
        tile.style.backgroundColor = '';
        tile.style.opacity = '';
    });

    document.querySelector('.connections-groups').innerHTML = '';
    updateMistakeDisplay();

    const allWords = CONNECTIONS_GROUPS.flatMap(group => group.words);
    shuffledWords = shuffleArray([...allWords]);

    tiles.forEach((tile, index) => {
        if (index < shuffledWords.length) {
            tile.textContent = shuffledWords[index];
        }
    });
}

function handleTileClick(tile) {
    if (tile.classList.contains('solved')) return;

    if (tile.classList.contains('selected')) {
        tile.classList.remove('selected');
        selectedTiles = selectedTiles.filter(t => t !== tile);
    } else {
        if (selectedTiles.length < 4) {
            tile.classList.add('selected');
            selectedTiles.push(tile);

            if (selectedTiles.length === 4) {
                setTimeout(() => checkSelectedGroup(), 100);
            }
        }
    }
}

function checkSelectedGroup() {
    const selectedWords = selectedTiles.map(tile => tile.textContent);

    let foundGroup = null;
    for (const group of CONNECTIONS_GROUPS) {
        if (foundGroups.includes(group)) continue;

        const matches = selectedWords.filter(word => group.words.includes(word)).length;
        if (matches === 4) {
            foundGroup = group;
            break;
        }
    }

    if (foundGroup) {
        selectedTiles.forEach(tile => {
            tile.classList.remove('selected');
            tile.classList.add('solved');
            tile.style.backgroundColor = getGroupColorValue(foundGroup.color);
        });

        foundGroups.push(foundGroup);

        const groupsContainer = document.querySelector('.connections-groups');
        const groupElement = document.createElement('div');
        groupElement.classList.add('found-group');
        groupElement.style.backgroundColor = getGroupColorValue(foundGroup.color);
        groupElement.innerHTML = `<h4>${foundGroup.name}</h4><p>${foundGroup.words.join(', ')}</p>`;
        groupsContainer.appendChild(groupElement);

        selectedTiles = [];
        showConnectionsFeedback(`Correct! Found "${foundGroup.name}"`, 'success');

        if (foundGroups.length === CONNECTIONS_GROUPS.length) {
            triggerConfetti();
            showConnectionsFeedback('You found all groups! 🎉', 'success');
            setTimeout(() => endConnectionsGame(), 1200);
            return;
        }
    } else {
        mistakeCount++;
        updateMistakeDisplay();
        showConnectionsFeedback('Not a group. Try again!', 'error');

        selectedTiles.forEach(tile => {
            tile.classList.add('shake');
            setTimeout(() => {
                tile.classList.remove('shake', 'selected');
            }, 500);
        });

        setTimeout(() => {
            selectedTiles = [];
        }, 500);

        if (mistakeCount >= MAX_MISTAKES) {
            setTimeout(() => {
                endConnectionsGame();
            }, 1000);
        }
    }
}

function getGroupColorValue(color) {
    const colors = {
        purple: '#8B5CF6',
        blue: '#3B82F6',
        yellow: '#F59E0B',
        green: '#10B981'
    };
    return colors[color] || '#6B7280';
}

function updateMistakeDisplay() {
    console.log(`Mistakes: ${mistakeCount}/${MAX_MISTAKES}`);
    let mistakeCounter = document.querySelector('.mistake-counter');
    if (!mistakeCounter) {
        mistakeCounter = document.createElement('div');
        mistakeCounter.classList.add('mistake-counter');
        document.getElementById('connections-game').prepend(mistakeCounter);
    }
    mistakeCounter.textContent = `Mistakes: ${mistakeCount}/${MAX_MISTAKES}`;
}

function showConnectionsFeedback(message, type) {
    let feedbackElement = document.querySelector('.connections-feedback');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.classList.add('connections-feedback');
        const gameContent = document.getElementById('connections-game');
        gameContent.insertBefore(feedbackElement, gameContent.querySelector('.connections-grid'));
    }

    feedbackElement.textContent = message;
    feedbackElement.className = `connections-feedback ${type}`;

    setTimeout(() => {
        if (feedbackElement) {
            feedbackElement.textContent = '';
            feedbackElement.className = 'connections-feedback';
        }
    }, 2000);
}

function endConnectionsGame() {
    const remainingGroups = CONNECTIONS_GROUPS.filter(group => !foundGroups.includes(group));
    const groupsContainer = document.querySelector('.connections-groups');

    remainingGroups.forEach(group => {
        const groupElement = document.createElement('div');
        groupElement.classList.add('found-group');
        groupElement.style.backgroundColor = getGroupColorValue(group.color);
        groupElement.style.opacity = '0.7';
        groupElement.innerHTML = `<h4>${group.name}</h4><p>${group.words.join(', ')}</p>`;
        groupsContainer.appendChild(groupElement);

        const tiles = document.querySelectorAll('.connections-tile');
        tiles.forEach(tile => {
            if (group.words.includes(tile.textContent) && !tile.classList.contains('solved')) {
                tile.style.backgroundColor = getGroupColorValue(group.color);
                tile.style.opacity = '0.7';
                tile.classList.add('solved');
            }
        });
    });

    showConnectionsFeedback(`Game Over! You found ${foundGroups.length}/${CONNECTIONS_GROUPS.length} groups.`, 'info');

    setTimeout(() => {
        resetConnectionsGame();
    }, 5000);
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// TRIVIA GAME
const TRIVIA_QUESTIONS = [
    {
        question: "What is Adi's favorite footwear?",
        options: ["Crocs", "Sneakers", "Sandals", "Boots"],
        answer: 0
    },
    {
        question: "What instrument does Adi play?",
        options: ["Guitar", "Piano", "Ukulele", "Drums"],
        answer: 2
    },
    {
        question: "Which place does Adi love to visit?",
        options: ["Paris", "Bali", "Tokyo", "London"],
        answer: 1
    },
    {
        question: "What team is Adi a fan of?",
        options: ["CSK", "MI", "RCB", "KKR"],
        answer: 2
    },
    {
        question: "What does Adi never achieve in academics?",
        options: ["8 GPA", "9 GPA", "10 GPA", "7 GPA"],
        answer: 1
    }
];

let triviaActive = false;
let currentQuestion = 0;
let score = 0;
let questionAnswered = false;

function initTrivia() {
    const startButton = document.getElementById('start-trivia');
    
    startButton.addEventListener('click', () => {
        if (!triviaActive || currentQuestion >= TRIVIA_QUESTIONS.length) {
            startTrivia();
        } else if (questionAnswered) {
            nextQuestion();
        }
    });
}

function startTrivia() {
    triviaActive = true;
    currentQuestion = 0;
    score = 0;
    questionAnswered = false;
    
    const startButton = document.getElementById('start-trivia');
    const resultElement = document.getElementById('result');
    
    startButton.textContent = 'Next Question';
    resultElement.textContent = '';
    
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= TRIVIA_QUESTIONS.length) {
        endTrivia();
        return;
    }
    
    const question = TRIVIA_QUESTIONS[currentQuestion];
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    
    questionElement.textContent = question.question;
    
    optionsContainer.innerHTML = '';
    question.options.forEach((option, index) => {
        const optionElement = document.createElement('div');
        optionElement.classList.add('option');
        optionElement.textContent = option;
        optionElement.addEventListener('click', () => selectOption(index));
        optionsContainer.appendChild(optionElement);
    });
    
    questionAnswered = false;
}

function selectOption(selectedIndex) {
    if (questionAnswered) return;
    
    questionAnswered = true;
    const options = document.querySelectorAll('.option');
    const correctIndex = TRIVIA_QUESTIONS[currentQuestion].answer;
    const resultElement = document.getElementById('result');
    const startButton = document.getElementById('start-trivia');
    
    // Show correct and incorrect answers
    options.forEach((option, index) => {
        if (index === correctIndex) {
            option.classList.add('correct');
        } else if (index === selectedIndex) {
            option.classList.add('incorrect');
        }
        option.style.pointerEvents = 'none'; // Disable further clicks
    });
    
    // Update score and show result
    if (selectedIndex === correctIndex) {
        score++;
        triggerConfetti();
        resultElement.textContent = 'Correct! 🎉';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'Wrong! 😞';
        resultElement.style.color = 'red';
    }
    
    // Update button text
    if (currentQuestion < TRIVIA_QUESTIONS.length - 1) {
        startButton.textContent = 'Next Question';
    } else {
        startButton.textContent = 'Show Results';
    }
}

function nextQuestion() {
    currentQuestion++;
    if (currentQuestion < TRIVIA_QUESTIONS.length) {
        showQuestion();
        document.getElementById('result').textContent = '';
    } else {
        endTrivia();
    }
}

function endTrivia() {
    const questionElement = document.getElementById('question');
    const optionsContainer = document.getElementById('options');
    const resultElement = document.getElementById('result');
    const startButton = document.getElementById('start-trivia');
    
    questionElement.textContent = `Quiz Completed! 🎊`;
    optionsContainer.innerHTML = '';
    resultElement.textContent = `Your final score: ${score}/${TRIVIA_QUESTIONS.length}`;
    resultElement.style.color = score === TRIVIA_QUESTIONS.length ? 'green' : 'blue';
    
    startButton.textContent = 'Play Again';
    triviaActive = false;
}

// Helper function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// --- Theme Toggle ---
function setTheme(theme) {
    document.body.classList.remove('light-mode', 'fun-mode');
    let emoji = '🌙';
    if (theme === 'light') {
        document.body.classList.add('light-mode');
        emoji = '☀️';
    } else if (theme === 'fun') {
        document.body.classList.add('fun-mode');
        emoji = '🎉';
    }
    const btn = document.getElementById('theme-toggle');
    if (btn) btn.textContent = emoji;
    localStorage.setItem('adi-theme', theme);
}
function cycleTheme() {
    const current = document.body.classList.contains('fun-mode') ? 'fun'
        : document.body.classList.contains('light-mode') ? 'light' : 'dark';
    const next = current === 'dark' ? 'light' : current === 'light' ? 'fun' : 'dark';
    setTheme(next);
}

// Initialize all games when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle Setup ---
    const themeBtn = document.getElementById('theme-toggle');
    if (themeBtn) {
        themeBtn.addEventListener('click', cycleTheme);
        // On load, restore theme
        let saved = localStorage.getItem('adi-theme');
        if (!saved) saved = 'dark';
        setTheme(saved);
    }

    // --- Adi Meme of the Day ---
    const memes = [
        // Old memes
        "Crocs on mountain peaks? Adi's the only one who can pull it off! 🥾⛰️",
        "Ukulele in one hand, hot chocolate in the other. That's the Popli way. 🎸☕",
        "RCB fan: pain is permanent, hope is eternal. 🏏😭",
        "Never got 9 GPA, but always got 10/10 vibes. 😎✨",
        "Gym karta hai but still 'motu'—legendary consistency! 💪🍩",
        "Chashme ke bina adha hai, par swag full hai. 🤓🕶️",
        "Binge-watching Impractical Jokers is a personality trait. 😆📺",
        "Makes puppy face to pass vivas. Professors can't resist! 🐶📚",
        "'Thala for a reason'—even MS Dhoni would agree. 07️⃣🏏",
        "Can play the forbidden riff on ukulele, but not in music stores! 🎸🚫",
        "Foodie by birth, Popli by choice. 🍔😌",
        "Calls himself 'Popli', and so does everyone else. #Branding 😌",
        "Hot chocolate > coffee. Change my mind. ☕🍫",
        "Curiosity level: Aditya. Always asking 'Why?' 🤔",
        "Bali dreams, Delhi memes. 🌴😂",
        "Breakup survival kit: Choco, Uke, Block. 💔🍫🎸",
        "Scaling peaks in Crocs since forever! 🥾⛰️",
        "If you see a guy smiling in viva, that's Adi bluffing. 😁🎓",
        "First rays of light, last to leave the party. 🌞🎉",
        "RCB loses, Adi still hopeful. #TrueFan 🏏🔥",
        // New roasts
        "Adi ke Crocs dekh ke lagta hai isne fashion sense ko nullah mein baha diya!",
        "Adi gym jaata hai, lekin uska progress Zomato delivery status jaisa hai—'10 minutes away'... for the last 6 months!",
        "Adi uke bajaata hai, par uske gaane sunke lagta hai Bandra footpath pe ek aur bhikari naya talent le aaya hai!",
        "Adi RCB ka fan hai… trophy dekhne ke liye kisi parallel universe ka wait kar raha hai!",
        "Adi ka chashma utaar do, toh woh duniya ka aadha hissa dekhna band kar dega… including his own gym progress!",
        "Adi ne viva mein puppy face bana ke professor ko bewakoof banaya… ab tak scam level: Chhota Bheem’s Kaalia!",
        "Adi ko hot chocolate se itna pyaar hai ki lagta hai uska breakup bhi Cadbury Dairy Milk ki wajah se hua tha!",
        "Adi ka GPA 9 nahi aaya, lekin viva mein puppy face ka score 10/10 hai!",
        "Adi ne breakup ke baad Roadies dekh ke life lessons liye… ab uska next plan hai Splitsvilla mein entry lena!",
        "Adi gym jaake 6 mahine se ‘abs’ banane ki koshish kar raha hai… ab tak uska pet Amul butter ke dabbe jaisa smooth ho gaya hai!"
    ];
    const memeBox = document.getElementById('adi-meme');
    if (memeBox) {
        const meme = memes[Math.floor(Math.random() * memes.length)];
        memeBox.textContent = meme;
    }

    // --- Music Toggle ---
    const musicBtn = document.getElementById('music-toggle');
    const audio = document.getElementById('adi-audio');
    let playing = false;
    if (musicBtn && audio) {
        musicBtn.addEventListener('click', () => {
            if (audio.paused) {
                audio.play();
                musicBtn.textContent = "Pause Adi's Song ⏸️";
            } else {
                audio.pause();
                musicBtn.textContent = "Play Adi's Song 🎵";
            }
        });
        audio.addEventListener('ended', () => {
            musicBtn.textContent = "Play Adi's Song 🎵";
        });
        document.addEventListener('visibilitychange', () => {
            if (document.hidden && !audio.paused) {
                audio.pause();
                musicBtn.textContent = "Play Adi's Song 🎵";
            }
        });
    }

    // Initialize games
    initWordle();
    initConnections();
    initTrivia();
    
    // Initialize other functions if they exist
    if (typeof initSitcoms === 'function') initSitcoms();
    if (typeof initLyrics === 'function') initLyrics();
});