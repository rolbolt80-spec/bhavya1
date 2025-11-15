document.addEventListener('DOMContentLoaded', () => {
    // --- Global Confetti/Sparkle Setup ---
    const confettiCanvas = document.getElementById('confetti-canvas');
    const confettiCtx = confettiCanvas.getContext('2d');
    let W, H;
    let maxConfetti = 75; // More confetti!
    let confettis = [];
    let animationTimer = null;

    function resizeCanvas() {
        W = confettiCanvas.width = window.innerWidth;
        H = confettiCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Helper functions for drawing custom confetti shapes
    function drawStar(ctx, x, y, points, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / points;

        ctx.beginPath();
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < points; i++) {
            x = x + Math.cos(rot) * outerRadius;
            y = y + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = x + Math.cos(rot) * innerRadius;
            y = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.closePath();
    }

    function drawFlower(ctx, x, y, size, color) {
        ctx.fillStyle = color;
        const petalCount = 5;
        const petalRadius = size / 2;

        for (let i = 0; i < petalCount; i++) {
            const angle = (i * 2 * Math.PI) / petalCount;
            const px = x + Math.cos(angle) * petalRadius;
            const py = y + Math.sin(angle) * petalRadius;

            ctx.beginPath();
            ctx.arc(px, py, petalRadius, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(x, y, petalRadius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow'; // Center of the flower
        ctx.fill();
    }

    function Confetti(x, y, color, type = 'confetti') {
        this.x = x;
        this.y = y;
        this.r = 1 + Math.random() * 3; 
        this.d = Math.random() * maxConfetti;
        this.color = color;
        this.tilt = Math.floor(Math.random() * 10) - 10;
        this.tiltAngle = 0;
        this.tiltAngleIncremental = (Math.random() * 0.07) + 0.05;
        this.speed = (Math.random() * 3) + 1;
        this.type = type; 
    }

    Confetti.prototype.draw = function() {
        confettiCtx.beginPath();
        if (this.type === 'star') {
            drawStar(confettiCtx, this.x, this.y, 5, this.r * 2, this.r);
            confettiCtx.fillStyle = this.color;
            confettiCtx.fill();
        } else if (this.type === 'flower') {
            drawFlower(confettiCtx, this.x, this.y, this.r * 1.5, this.color);
        } else { // default confetti
            confettiCtx.strokeStyle = this.color;
            confettiCtx.lineWidth = 2;
            confettiCtx.moveTo(this.x + this.tilt + this.r, this.y);
            confettiCtx.lineTo(this.x + this.tilt, this.y + this.r);
            confettiCtx.stroke();
        }
    };

    function drawConfetti() {
        confettiCtx.clearRect(0, 0, W, H);
        let i = 0;
        for (i = 0; i < confettis.length; i++) {
            updateConfetti(confettis[i], i);
        }
    }

    function updateConfetti(confetti, index) {
        confetti.tiltAngle += confetti.tiltAngleIncremental;
        confetti.y += (Math.cos(confetti.d) + 3 + confetti.speed);
        confetti.tilt = (Math.sin(confetti.tiltAngle) * 20);

        if (confetti.y > H) {
            confettis.splice(index, 1);
            const type = ['confetti', 'star', 'flower'][Math.floor(Math.random() * 3)];
            confettis.push(new Confetti(Math.random() * W, -10, `hsl(${Math.random() * 360}, 100%, 70%)`, type));
        }
        confetti.draw();
    }

    function startConfettiBurst(duration = 5000) {
        if (animationTimer) clearInterval(animationTimer);
        confettis = []; 
        for (let i = 0; i < maxConfetti; i++) {
            const type = ['confetti', 'star', 'flower'][Math.floor(Math.random() * 3)];
            confettis.push(new Confetti(Math.random() * W, Math.random() * H, `hsl(${Math.random() * 360}, 100%, 70%)`, type));
        }
        animationTimer = setInterval(drawConfetti, 30);
        setTimeout(stopConfetti, duration);
    }

    function stopConfetti() {
        clearInterval(animationTimer);
        confettis = [];
        confettiCtx.clearRect(0, 0, W, H);
        animationTimer = null;
    }

    // --- Click Sparkle Effect ---
    function createClickSparkle(x, y) {
        const sparkle = document.createElement('div');
        sparkle.className = 'click-sparkle';
        sparkle.style.left = `${x}px`;
        sparkle.style.top = `${y}px`;
        document.body.appendChild(sparkle);

        // Remove after animation
        sparkle.addEventListener('animationend', () => {
            sparkle.remove();
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.cute-button, .card, .profile-photo-container, .butterfly')) {
             createClickSparkle(e.clientX, e.clientY);
        }
    });


    // --- Global Game State ---
    const gameStatus = {
        game1: false,
        game2: false,
        game3: false
    };

    const revealButton = document.getElementById('revealButton');
    const hiddenMessage = document.getElementById('hiddenMessage');
    const photoGallery = document.getElementById('photoGallery');
    const progress1 = document.getElementById('progress1');
    const progress2 = document.getElementById('progress2');
    const progress3 = document.getElementById('progress3');

    function updateProgress() {
        const checkIcon = '<i class="fas fa-check-circle text-green animated-check"></i>';
        const crossIcon = '<i class="fas fa-times-circle text-red"></i>';

        progress1.innerHTML = `Guess: ${gameStatus.game1 ? checkIcon : crossIcon}`;
        progress2.innerHTML = `Memory: ${gameStatus.game2 ? checkIcon : crossIcon}`;
        progress3.innerHTML = `Butterfly: ${gameStatus.game3 ? checkIcon : crossIcon}`;

        if (gameStatus.game1 && gameStatus.game2 && gameStatus.game3) {
            revealButton.disabled = false;
            revealButton.classList.remove('disabled-button');
            revealButton.classList.add('glowing-button'); // Add glowing effect
            revealButton.innerHTML = '<i class="fas fa-unlock animated-icon"></i> UNLOCKED! View Your Magical Gift! <i class="fas fa-unlock animated-icon"></i>';
            startConfettiBurst(7000); 
        }
    }

    // --- Reveal Gift Handler ---
    revealButton.addEventListener('click', () => {
        if (!revealButton.disabled) {
            hiddenMessage.classList.remove('hidden');
            photoGallery.classList.remove('hidden');
            revealButton.classList.add('hidden'); 
            
            startConfettiBurst(10000); 
            
            hiddenMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });


    // =========================================================================
    // 1. Fairy Number Guess (Number Guessing)
    // =========================================================================
    const guessInput = document.getElementById('guessInput');
    const guessButton = document.getElementById('guessButton');
    const game1Result = document.getElementById('game1Result');
    const game2Area = document.getElementById('game2-area');
    
    const correctNumber = Math.floor(Math.random() * 10) + 1;
    let attempts = 0;

    guessButton.addEventListener('click', () => {
        if (gameStatus.game1) return;

        const userGuess = parseInt(guessInput.value);

        if (isNaN(userGuess) || userGuess < 1 || userGuess > 10) {
            game1Result.textContent = 'Please enter a valid number between 1 and 10.';
            return;
        }

        attempts++;
        createClickSparkle(guessButton.getBoundingClientRect().x + guessButton.offsetWidth / 2, guessButton.getBoundingClientRect().y + guessButton.offsetHeight / 2);


        if (userGuess === correctNumber) {
            gameStatus.game1 = true;
            game1Result.innerHTML = `🎉 **MAGICAL!** The number was ${correctNumber}. You found it in ${attempts} try(s)!`;
            guessInput.disabled = true;
            guessButton.disabled = true;
            game2Area.classList.remove('hidden-game');
            game2Area.scrollIntoView({ behavior: 'smooth', block: 'center' });
            updateProgress();
        } else if (userGuess < correctNumber) {
            game1Result.textContent = 'A little higher, like a sprouting seed!';
        } else {
            game1Result.textContent = 'A touch lower, like a falling leaf!';
        }
    });


    // =========================================================================
    // 2. Blossom Memory Match Game Logic
    // =========================================================================
    const memoryGrid = document.getElementById('memoryGrid');
    const game2Result = document.getElementById('game2Result');
    const game3Area = document.getElementById('game3-area');

    const cardIcons = ['🌸', '🌼', '🌺', '🌷', '🦋', '🐞']; 
    const gameCards = [...cardIcons, ...cardIcons];
    gameCards.sort(() => Math.random() - 0.5); 

    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false;

    function createBoard() {
        memoryGrid.innerHTML = '';
        gameCards.forEach((icon, index) => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.icon = icon;
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-back"><i class="fas fa-question text-primary"></i></div>
                    <div class="card-face">${icon}</div>
                </div>
            `;
            card.addEventListener('click', () => flipCard(card));
            memoryGrid.appendChild(card);
        });
    }

    function flipCard(card) {
        if (gameStatus.game2 || lockBoard || card.classList.contains('matched') || card === flippedCards[0]) return;

        card.classList.add('flipped');
        flippedCards.push(card);
        createClickSparkle(card.getBoundingClientRect().x + card.offsetWidth / 2, card.getBoundingClientRect().y + card.offsetHeight / 2);


        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.icon === card2.dataset.icon;

        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            
            card1.style.animation = 'cardMatchPop 0.3s ease-out';
            card2.style.animation = 'cardMatchPop 0.3s ease-out';
            
            setTimeout(() => {
                card1.style.animation = '';
                card2.style.animation = '';
            }, 300);

            resetBoard();

            if (matchedPairs === cardIcons.length) {
                gameStatus.game2 = true;
                game2Result.innerHTML = '✨ **BLOSSOM MASTER!** All pairs bloomed beautifully!';
                game3Area.classList.remove('hidden-game');
                game3Area.scrollIntoView({ behavior: 'smooth', block: 'center' });
                updateProgress();
            }
        } else {
            unflipCards();
        }
    }

    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('flipped');
            flippedCards[1].classList.remove('flipped');
            resetBoard();
        }, 1000);
    }

    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    createBoard(); 


    // =========================================================================
    // 3. Butterfly Pop Game Logic
    // =========================================================================
    const targetBalloon = document.getElementById('targetBalloon'); 
    const startBalloonGameButton = document.getElementById('startBalloonGame');
    const game3Result = document.getElementById('game3Result');
    const balloonTimerDisplay = document.getElementById('balloonTimer');

    const maxClicks = 3;
    const gameTime = 7; 
    let clicks = 0;
    let timer;
    let timeLeft;
    let gameActive = false;

    function updateTimerDisplay() {
        balloonTimerDisplay.textContent = `Time Left: ${timeLeft.toFixed(1)}s | Catches Left: ${maxClicks - clicks}`;
    }

    function startTimer() {
        gameActive = true;
        targetBalloon.style.cursor = 'pointer';
        startBalloonGameButton.disabled = true;
        game3Result.textContent = 'Flutter & Catch!';

        // Random starting position
        targetBalloon.style.transform = `translate(${Math.random() * 80 - 40}%, ${Math.random() * 80 - 40}%) scale(1)`;
        targetBalloon.style.opacity = 1;
        targetBalloon.classList.remove('caught'); 
        targetBalloon.classList.add('glowing-butterfly');

        const startTime = Date.now();

        timer = setInterval(() => {
            timeLeft = gameTime - (Date.now() - startTime) / 1000;
            updateTimerDisplay();

            if (timeLeft <= 0) {
                clearInterval(timer);
                endGame(false);
            }
        }, 100);
    }

    function endGame(win) {
        gameActive = false;
        clearInterval(timer);
        targetBalloon.style.cursor = 'default';
        startBalloonGameButton.disabled = false;
        balloonTimerDisplay.textContent = '';
        targetBalloon.classList.remove('glowing-butterfly'); 

        if (win) {
            gameStatus.game3 = true;
            game3Result.innerHTML = '🌟 **BUTTERFLY WHISPERER!** You caught them all!';
            startBalloonGameButton.textContent = 'Game Complete!';
            startBalloonGameButton.disabled = true;
            updateProgress();
        } else {
            game3Result.textContent = clicks === maxClicks ? 'Time ran out! Try again!' : 'Time\'s up! The butterfly escaped!';
            startBalloonGameButton.textContent = 'Try Again';
            resetGame();
        }
    }

    function resetGame() {
        clicks = 0;
        timeLeft = gameTime;
        targetBalloon.classList.remove('caught');
        targetBalloon.style.opacity = 1;
        targetBalloon.classList.add('glowing-butterfly'); 
    }

    targetBalloon.addEventListener('click', (e) => {
        if (!gameActive || gameStatus.game3) return;

        clicks++;
        game3Result.textContent = `Catch! Catches: ${clicks}`;
        updateTimerDisplay();
        createClickSparkle(e.clientX, e.clientY);

        // Visual feedback for catch and new random position
        targetBalloon.style.transform += ' scale(0.8)';
        setTimeout(() => {
             targetBalloon.style.transform = `translate(${Math.random() * 80 - 40}%, ${Math.random() * 80 - 40}%) scale(1)`; 
        }, 200);


        if (clicks >= maxClicks) {
            targetBalloon.classList.add('caught');
            endGame(true);
        }
    });

    startBalloonGameButton.addEventListener('click', () => {
        if (gameStatus.game3) return;
        resetGame();
        startTimer();
    });
    
    resetGame(); 

    // =========================================================================
    // 4. Wish Wall Logic
    // =========================================================================
    const wishes = [
        "happiest birthday pretty little bouni🥰💝 🎂",
        "May your day be as sparkling as a supernova! 🎂",
        "Wishing you a year filled with cosmic joy and success!",
        "May your light shine brighter than the North Star! ✨",
        "Hope your birthday is out of this world! 🚀",
        "Happy Birthday to the most stellar friend! ❤️",
        "May all your birthday wishes come true, like a shooting star!",
        "You are a true galaxy of talent! Keep shining!",
        "May your cake be sweet and your journey amazing!",
    ];

    const wishWall = document.getElementById('wishWall');
    const showNextWishButton = document.getElementById('showNextWishButton');
    let currentWishIndex = 0;

    function showNextWish() {
        wishWall.style.opacity = 0;

        setTimeout(() => {
            wishWall.innerHTML = `<p>${wishes[currentWishIndex]}</p>`;
            wishWall.style.opacity = 1;

            currentWishIndex = (currentWishIndex + 1) % wishes.length;
        }, 500); 
    }
    
    showNextWishButton.addEventListener('click', showNextWish);
    
    setTimeout(showNextWish, 1000);

    updateProgress();
});
