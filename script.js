const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' }
];

const translateBtn = document.getElementById('translate-btn');
const languageDropdown = document.getElementById('language-dropdown');
let currentLanguage = 'en'; // Default to English
const audio = document.getElementById('sea-sounds');
const toggleSoundBtn = document.getElementById('toggle-sound');
let isPlaying = false;

function populateDropdown(selectedLanguage) {
    languageDropdown.innerHTML = '';
    languages.forEach(lang => {
        if (lang.name !== selectedLanguage) {
            const button = document.createElement('button');
            button.textContent = lang.name;
            button.setAttribute('data-lang', lang.code);
            languageDropdown.appendChild(button);
        }
    });
}

// Initialize dropdown with languages excluding the default language (English)
populateDropdown('English');

translateBtn.addEventListener('click', () => {
    languageDropdown.style.display = languageDropdown.style.display === 'block' ? 'none' : 'block';
});

languageDropdown.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const targetLanguage = event.target.getAttribute('data-lang');
        const selectedLanguage = event.target.textContent;

        translateBtn.textContent = selectedLanguage;
        currentLanguage = targetLanguage;
        languageDropdown.style.display = 'none';

        translateQuote(currentLanguage);

        // Update dropdown with the new selected language removed and the previous one added back
        populateDropdown(selectedLanguage);
    }
});

async function translateQuote(targetLanguage) {
    const quoteElement = document.getElementById('quote');
    const originalQuoteText = quoteElement.textContent;

    // Fade out the quote while translating
    quoteElement.style.opacity = '0';

    try {
        const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(originalQuoteText)}`);
        const translation = await response.json();
        
        // Wait for the fade-out animation to complete before showing the translation
        setTimeout(() => {
            quoteElement.textContent = translation[0][0][0];
            quoteElement.style.opacity = '1'; // Fade in the translated quote
        }, 500); // Match this delay with the CSS transition duration (0.5s)
    } catch (error) {
        console.error('Error translating quote:', error);
        alert('Translation failed. Please try again later.');
        quoteElement.textContent = originalQuoteText;
        quoteElement.style.opacity = '1'; // Ensure the quote is visible even if there's an error
    }
}

// Fetch and display quote
async function fetchQuote() {
    const quoteElement = document.getElementById('quote');

    // Fade out the current quote
    quoteElement.style.opacity = '0';

    try {
        const response = await fetch('https://api.quotable.io/random');
        const data = await response.json();

        // Wait for the fade-out animation to complete before changing the quote
        setTimeout(() => {
            quoteElement.textContent = `"${data.content}" - ${data.author}`;

            // Automatically translate the new quote if the language is not English
            if (currentLanguage !== 'en') {
                translateQuote(currentLanguage);
            } else {
                // Fade in the new quote
                quoteElement.style.opacity = '1';
            }
        }, 500); // Match this delay with the CSS transition duration (0.5s)
    } catch (error) {
        console.error('Error fetching quote:', error);
        quoteElement.textContent = "Believe in yourself and all that you are. Know that there is something inside you that is greater than any obstacle.";
        quoteElement.style.opacity = '1'; // Ensure the quote is visible even if there's an error
    }
}

fetchQuote();

// New Quote button
const newQuoteBtn = document.getElementById('new-quote-btn');
newQuoteBtn.addEventListener('click', () => {
    fetchQuote();
});

// Toggle sound button
toggleSoundBtn.addEventListener('click', () => {
    if (isPlaying) {
        audio.pause();
        toggleSoundBtn.textContent = 'Play Music';
    } else {
        audio.play();
        toggleSoundBtn.textContent = 'Pause Music';
    }
    isPlaying = !isPlaying;
});

// Animated starry background
const canvas = document.getElementById('stars');
const ctx = canvas.getContext('2d');
let stars = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initStars();
}

function initStars() {
    stars = [];
    for (let i = 0; i < 200; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            radius: Math.random() * 1.5,
            speed: Math.random() * 0.2,
            hue: Math.random() * 60 + 180 // Blue to cyan hues
        });
    }
}

function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${star.hue}, 100%, 50%, ${Math.random() * 0.5 + 0.5})`;
        ctx.fill();
        star.y += star.speed;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect
        star.radius = Math.random() * 1.5;
    });
    requestAnimationFrame(drawStars);
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
drawStars();
