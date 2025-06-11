// Rap Memory Game
document.addEventListener('DOMContentLoaded', () => {
    initRapMemoryGame();
});

function initRapMemoryGame() {
    const rapGameBoard = document.getElementById('rap-memory-board');
    const startButton = document.getElementById('start-rap-memory');
    const pairsFoundElement = document.getElementById('rap-pairs-found');
    const movesElement = document.getElementById('rap-moves');
    const timerElement = document.getElementById('rap-timer');
    
    let cards = [];
    let hasFlippedCard = false;
    let lockBoard = false;
    let firstCard, secondCard;
    let moves = 0;
    let pairsFound = 0;
    let timer;
    let seconds = 0;
    let minutes = 0;
    
    // Rap lyrics data - pairs of lyrics from the same rapper
    const rapLyrics = [
        // Seedhe Maut
        { 
            rapper: 'Seedhe Maut', 
            lyrics: 'Hum seedhe maut, tum seedhe fraud',
            image: 'seedhemaut.jpeg'
        },
        { 
            rapper: 'Seedhe Maut', 
            lyrics: 'Namumkin ko mumkin karna hamara kaam hai',
            image: 'seedhemaut.jpeg'
        },
        { 
            rapper: 'Seedhe Maut', 
            lyrics: 'Jeet hamari, haar tumhari, ye to tay hai',
            image: 'seedhemaut.jpeg'
        },
        
        // Bali
        { 
            rapper: 'Bali', 
            lyrics: 'Ye rap nahi meri jaan, meri pehchaan',
            image: 'bali.jpeg'
        },
        { 
            rapper: 'Bali', 
            lyrics: 'Mera imaan, mera armaan, meri awaaz',
            image: 'bali.jpeg'
        },
        { 
            rapper: 'Bali', 
            lyrics: 'Saza-e-maut se darr nahi lagta',
            image: 'bali.jpeg'
        },
        
        // Dank Rishu
        { 
            rapper: 'Dank Rishu', 
            lyrics: 'Teri zubaan se nikle fraud',
            image: 'dankrishu.jpeg'
        },
        { 
            rapper: 'Dank Rishu', 
            lyrics: 'Tere dimaag mein chale fraud',
            image: 'dankrishu.jpeg'
        },
        { 
            rapper: 'Dank Rishu', 
            lyrics: 'Sach kadwa hai par hai zaroori',
            image: 'dankrishu.jpeg'
        }
    ];
    
    // Start button event listener
    startButton.addEventListener('click', startGame);
    
    function startGame() {
        resetGame();
        createCards();
        startTimer();
    }
    
    function resetGame() {
        rapGameBoard.innerHTML = '';
        hasFlippedCard = false;
        lockBoard = false;
        firstCard = null;
        secondCard = null;
        moves = 0;
        pairsFound = 0;
        seconds = 0;
        minutes = 0;
        
        // Reset UI
        pairsFoundElement.textContent = '0';
        movesElement.textContent = '0';
        timerElement.textContent = '00:00';
        
        // Clear timer if it exists
        if (timer) {
            clearInterval(timer);
        }
    }
    
    function createCards() {
        // Select 6 random lyrics (2 from each rapper)
        const selectedLyrics = [];
        const rappers = ['Seedhe Maut', 'Bali', 'Dank Rishu'];
        
        rappers.forEach(rapper => {
            const rapperLyrics = rapLyrics.filter(item => item.rapper === rapper);
            // Get 2 random lyrics from each rapper
            const shuffledRapperLyrics = rapperLyrics.sort(() => 0.5 - Math.random());
            selectedLyrics.push(...shuffledRapperLyrics.slice(0, 2));
        });
        
        // Create pairs of cards (one with lyrics, one with rapper name)
        cards = [];
        
        selectedLyrics.forEach(item => {
            // Create a lyrics card
            cards.push({
                rapper: item.rapper,
                content: item.lyrics,
                image: item.image,
                type: 'lyrics'
            });
            
            // Create a matching rapper card
            cards.push({
                rapper: item.rapper,
                content: item.rapper,
                image: item.image,
                type: 'rapper'
            });
        });
        
        // Shuffle the cards
        cards = shuffleArray(cards);
        
        // Create card elements
        cards.forEach((card, index) => {
            const cardElement = document.createElement('div');
            cardElement.classList.add('memory-card');
            cardElement.dataset.rapper = card.rapper;
            cardElement.dataset.index = index;
            
            // Create front face (content)
            const frontFace = document.createElement('div');
            frontFace.classList.add('front-face');
            frontFace.textContent = card.content;
            
            // Create back face (logo)
            const backFace = document.createElement('div');
            backFace.classList.add('back-face');
            const logoImg = document.createElement('img');
            logoImg.src = 'https://img.icons8.com/fluency/96/000000/musical-notes.png';
            logoImg.alt = 'Music Note';
            backFace.appendChild(logoImg);
            
            // Append faces to card
            cardElement.appendChild(frontFace);
            cardElement.appendChild(backFace);
            
            // Add click event
            cardElement.addEventListener('click', flipCard);
            
            // Append card to board
            rapGameBoard.appendChild(cardElement);
        });
    }
    
    function flipCard() {
        if (lockBoard) return;
        if (this === firstCard) return;
        
        this.classList.add('flip');
        
        if (!hasFlippedCard) {
            // First card flipped
            hasFlippedCard = true;
            firstCard = this;
            return;
        }
        
        // Second card flipped
        secondCard = this;
        checkForMatch();
        
        // Increment moves
        moves++;
        movesElement.textContent = moves;
    }
    
    function checkForMatch() {
        // Check if the two flipped cards match (same rapper)
        const isMatch = firstCard.dataset.rapper === secondCard.dataset.rapper;
        
        if (isMatch) {
            disableCards();
            pairsFound++;
            pairsFoundElement.textContent = pairsFound;
            
            // Check if all pairs are found
            if (pairsFound === 6) {
                setTimeout(() => {
                    endGame();
                }, 1000);
            }
        } else {
            unflipCards();
        }
    }
    
    function disableCards() {
        firstCard.classList.add('matched');
        secondCard.classList.add('matched');
        
        firstCard.removeEventListener('click', flipCard);
        secondCard.removeEventListener('click', flipCard);
        
        resetBoard();
    }
    
    function unflipCards() {
        lockBoard = true;
        
        // Show incorrect selection feedback
        firstCard.classList.add('incorrect');
        secondCard.classList.add('incorrect');
        
        // Find and briefly show the correct matches
        showCorrectMatches();
        
        setTimeout(() => {
            // Remove incorrect class and flip back
            firstCard.classList.remove('flip', 'incorrect');
            secondCard.classList.remove('flip', 'incorrect');
            
            // Hide any temporarily shown correct matches
            hideCorrectMatches();
            
            resetBoard();
        }, 2000);
    }
    
    function showCorrectMatches() {
        // Get the rappers of the two incorrectly matched cards
        const firstRapper = firstCard.dataset.rapper;
        const secondRapper = secondCard.dataset.rapper;
        
        // Find all cards for each rapper
        const firstRapperCards = Array.from(document.querySelectorAll(`.memory-card[data-rapper="${firstRapper}"]`));
        const secondRapperCards = Array.from(document.querySelectorAll(`.memory-card[data-rapper="${secondRapper}"]`));
        
        // Show correct matches for first card if not already matched
        if (!firstRapperCards.every(card => card.classList.contains('matched'))) {
            firstRapperCards.forEach(card => {
                if (card !== firstCard && !card.classList.contains('matched')) {
                    card.classList.add('correct-hint', 'flip');
                }
            });
        }
        
        // Show correct matches for second card if not already matched
        if (!secondRapperCards.every(card => card.classList.contains('matched'))) {
            secondRapperCards.forEach(card => {
                if (card !== secondCard && !card.classList.contains('matched')) {
                    card.classList.add('correct-hint', 'flip');
                }
            });
        }
    }
    
    function hideCorrectMatches() {
        // Hide any cards that were temporarily shown as hints
        document.querySelectorAll('.correct-hint').forEach(card => {
            if (!card.classList.contains('matched')) {
                card.classList.remove('correct-hint', 'flip');
            }
        });
    }
    
    function resetBoard() {
        [hasFlippedCard, lockBoard] = [false, false];
        [firstCard, secondCard] = [null, null];
    }
    
    function startTimer() {
        timer = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }, 1000);
    }
    
    function endGame() {
        clearInterval(timer);
        
        // Show congratulations message
        const congratsMessage = document.createElement('div');
        congratsMessage.classList.add('congrats-message');
        congratsMessage.innerHTML = `
            <h3>Congratulations! 🎉</h3>
            <p>You completed the game in ${minutes}:${seconds.toString().padStart(2, '0')} with ${moves} moves!</p>
            <button id="play-again" class="start-btn">Play Again</button>
        `;
        
        rapGameBoard.innerHTML = '';
        rapGameBoard.appendChild(congratsMessage);
        
        document.getElementById('play-again').addEventListener('click', startGame);
    }
    
    // Utility function to shuffle an array
    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }
    
    // Initialize the game board
    startGame();
}
