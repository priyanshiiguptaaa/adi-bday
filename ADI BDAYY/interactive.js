// Sitcoms Section
function initSitcoms() {
    const addSitcomBtn = document.getElementById('add-sitcom-btn');
    const sitcomNameInput = document.getElementById('sitcom-name');
    const sitcomQuoteInput = document.getElementById('sitcom-quote');
    const sitcomsContainer = document.querySelector('.sitcoms-container');
    
    // Load saved sitcoms from localStorage
    loadSavedSitcoms();
    
    addSitcomBtn.addEventListener('click', () => {
        const sitcomName = sitcomNameInput.value.trim();
        const sitcomQuote = sitcomQuoteInput.value.trim();
        
        if (sitcomName && sitcomQuote) {
            // Create new sitcom card
            addNewSitcom(sitcomName, sitcomQuote);
            
            // Clear inputs
            sitcomNameInput.value = '';
            sitcomQuoteInput.value = '';
            
            // Save to localStorage
            saveSitcoms();
        } else {
            alert('Please enter both a sitcom name and a quote!');
        }
    });
    
    function addNewSitcom(name, quote, isLoading = false) {
        const sitcomCard = document.createElement('div');
        sitcomCard.className = 'sitcom-card';
        sitcomCard.setAttribute('data-show', name.toLowerCase().replace(/\s+/g, '-'));
        
        const placeholderImage = 'https://via.placeholder.com/300x200/1e1e1e/ffffff?text=' + encodeURIComponent(name);
        
        sitcomCard.innerHTML = `
            <div class="sitcom-image">
                <img src="${placeholderImage}" alt="${name}">
            </div>
            <div class="sitcom-info">
                <h3>${name}</h3>
                <div class="quotes-container">
                    <p class="quote">${quote}</p>
                </div>
            </div>
        `;
        
        sitcomsContainer.appendChild(sitcomCard);
        
        // Apply animation
        if (!isLoading) {
            const index = document.querySelectorAll('.sitcom-card').length - 1;
            sitcomCard.style.setProperty('--i', index);
        }
    }
    
    function loadSavedSitcoms() {
        const savedSitcoms = JSON.parse(localStorage.getItem('adiSitcoms') || '[]');
        
        savedSitcoms.forEach(sitcom => {
            addNewSitcom(sitcom.name, sitcom.quote, true);
        });
    }
    
    function saveSitcoms() {
        const sitcomCards = document.querySelectorAll('.sitcom-card');
        const sitcoms = [];
        
        sitcomCards.forEach(card => {
            const name = card.querySelector('h3').textContent;
            const quotes = card.querySelectorAll('.quote');
            const quote = quotes[quotes.length - 1].textContent;
            
            sitcoms.push({ name, quote });
        });
        
        localStorage.setItem('adiSitcoms', JSON.stringify(sitcoms));
    }
}

// Lyrics Section
function initLyrics() {
    const addLyricsBtn = document.getElementById('add-lyrics-btn');
    const artistNameInput = document.getElementById('artist-name');
    const songTitleInput = document.getElementById('song-title');
    const lyricsTextInput = document.getElementById('lyrics-text');
    const lyricsContainer = document.querySelector('.lyrics-container');
    
    // Load saved lyrics from localStorage
    loadSavedLyrics();
    
    addLyricsBtn.addEventListener('click', () => {
        const artistName = artistNameInput.value.trim();
        const songTitle = songTitleInput.value.trim();
        const lyricsText = lyricsTextInput.value.trim();
        
        if (artistName && songTitle && lyricsText) {
            // Create new lyrics card
            addNewLyrics(artistName, songTitle, lyricsText);
            
            // Clear inputs
            artistNameInput.value = '';
            songTitleInput.value = '';
            lyricsTextInput.value = '';
            
            // Save to localStorage
            saveLyrics();
        } else {
            alert('Please fill in all fields!');
        }
    });
    
    function addNewLyrics(artist, song, lyrics, isLoading = false) {
        const lyricsCard = document.createElement('div');
        lyricsCard.className = 'lyrics-card';
        
        // Format lyrics for display (split by lines)
        const formattedLyrics = lyrics.split('\n')
            .map(line => `<p>${line}</p>`)
            .join('');
        
        lyricsCard.innerHTML = `
            <div class="artist-info">
                <h3>${artist}</h3>
                <p class="song-title">${song}</p>
            </div>
            <div class="lyrics">
                ${formattedLyrics}
            </div>
        `;
        
        lyricsContainer.appendChild(lyricsCard);
        
        // Apply animation
        if (!isLoading) {
            const index = document.querySelectorAll('.lyrics-card').length - 1;
            lyricsCard.style.setProperty('--i', index);
        }
    }
    
    function loadSavedLyrics() {
        const savedLyrics = JSON.parse(localStorage.getItem('adiLyrics') || '[]');
        
        savedLyrics.forEach(item => {
            addNewLyrics(item.artist, item.song, item.lyrics, true);
        });
    }
    
    function saveLyrics() {
        const lyricsCards = document.querySelectorAll('.lyrics-card');
        const lyricsItems = [];
        
        lyricsCards.forEach(card => {
            const artist = card.querySelector('h3').textContent;
            const song = card.querySelector('.song-title').textContent;
            
            // Combine all paragraph elements into a single string with newlines
            const lyrics = Array.from(card.querySelectorAll('.lyrics p'))
                .map(p => p.textContent.replace(/^\"|\"$/g, '')) // Remove quotes if present
                .join('\n');
            
            lyricsItems.push({ artist, song, lyrics });
        });
        
        localStorage.setItem('adiLyrics', JSON.stringify(lyricsItems));
    }
}

// Apply animation delays to sitcom and lyrics cards
document.addEventListener('DOMContentLoaded', () => {
    const sitcomCards = document.querySelectorAll('.sitcom-card');
    sitcomCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
    
    const lyricsCards = document.querySelectorAll('.lyrics-card');
    lyricsCards.forEach((card, index) => {
        card.style.setProperty('--i', index);
    });
});
