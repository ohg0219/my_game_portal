// 메모리 게임 JavaScript

class MemoryGame {
    constructor() {
        this.gameState = {
            level: null,
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            attempts: 0,
            startTime: null,
            timer: null,
            isGameActive: false,
            isPaused: false
        };

        this.emojis = ['🎭', '🎨', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎮', '🎊', '🎉', '🌟', '⭐', '🎈', '🎁'];

        this.initElements();
        this.bindEvents();
    }

    initElements() {
        this.difficultySelector = document.getElementById('difficultySelector');
        this.gameBoard = document.getElementById('gameBoard');
        this.gameControls = document.getElementById('gameControls');
        this.memoryGrid = document.getElementById('memoryGrid');

        this.timerElement = document.getElementById('timer');
        this.attemptsElement = document.getElementById('attempts');
        this.matchesElement = document.getElementById('matches');

        this.gameCompleteModal = document.getElementById('gameCompleteModal');
        this.pauseModal = document.getElementById('pauseModal');

        this.newGameBtn = document.getElementById('newGameBtn');
        this.pauseBtn = document.getElementById('pauseBtn');
        this.playAgainBtn = document.getElementById('playAgainBtn');
        this.changeDifficultyBtn = document.getElementById('changeDifficultyBtn');
        this.resumeBtn = document.getElementById('resumeBtn');
        this.quitBtn = document.getElementById('quitBtn');
    }

    bindEvents() {
        // 난이도 선택 버튼
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const level = btn.dataset.level;
                this.startGame(level);
            });
        });

        // 컨트롤 버튼들
        this.newGameBtn.addEventListener('click', () => this.showDifficultySelector());
        this.pauseBtn.addEventListener('click', () => this.togglePause());

        // 모달 버튼들
        this.playAgainBtn.addEventListener('click', () => this.restartGame());
        this.changeDifficultyBtn.addEventListener('click', () => this.showDifficultySelector());
        this.resumeBtn.addEventListener('click', () => this.togglePause());
        this.quitBtn.addEventListener('click', () => this.showDifficultySelector());

        // 키보드 이벤트
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
    }

    startGame(level) {
        this.gameState.level = level;
        this.gameState.isGameActive = true;
        this.gameState.isPaused = false;
        this.gameState.attempts = 0;
        this.gameState.matchedPairs = 0;
        this.gameState.flippedCards = [];
        this.gameState.startTime = Date.now();

        this.createCards();
        this.renderCards();
        this.startTimer();
        this.updateStats();

        this.difficultySelector.style.display = 'none';
        this.gameBoard.style.display = 'block';
        this.gameControls.style.display = 'flex';

        this.pauseBtn.textContent = '일시정지';
    }

    createCards() {
        const cardCounts = {easy: 8, medium: 10, hard: 18};
        const pairCount = cardCounts[this.gameState.level];

        const selectedEmojis = this.emojis.slice(0, pairCount);
        const cardPairs = [...selectedEmojis, ...selectedEmojis];

        this.gameState.cards = this.shuffleArray(cardPairs).map((emoji, index) => ({
            id: index,
            emoji: emoji,
            isFlipped: false,
            isMatched: false
        }));
    }

    shuffleArray(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    renderCards() {
        this.memoryGrid.innerHTML = '';
        this.memoryGrid.className = `memory-grid ${this.gameState.level}`;

        this.gameState.cards.forEach(card => {
            const cardElement = this.createCardElement(card);
            this.memoryGrid.appendChild(cardElement);
        });
    }

    createCardElement(card) {
        const cardDiv = document.createElement('div');
        cardDiv.className = 'memory-card';
        cardDiv.dataset.cardId = card.id;

        if (card.isFlipped || card.isMatched) {
            cardDiv.classList.add('flipped');
            cardDiv.textContent = card.emoji;
        }

        if (card.isMatched) {
            cardDiv.classList.add('matched');
        }

        cardDiv.addEventListener('click', () => this.flipCard(card.id));

        return cardDiv;
    }

    flipCard(cardId) {
        if (!this.gameState.isGameActive || this.gameState.isPaused) return;

        const card = this.gameState.cards[cardId];
        if (card.isFlipped || card.isMatched || this.gameState.flippedCards.length >= 2) return;

        card.isFlipped = true;
        this.gameState.flippedCards.push(cardId);

        const cardElement = document.querySelector(`[data-card-id="${cardId}"]`);
        cardElement.classList.add('flipped');
        cardElement.textContent = card.emoji;

        if (this.gameState.flippedCards.length === 2) {
            this.gameState.attempts++;
            this.updateStats();
            setTimeout(() => this.checkMatch(), 1000);
        }
    }

    checkMatch() {
        const [card1Id, card2Id] = this.gameState.flippedCards;
        const card1 = this.gameState.cards[card1Id];
        const card2 = this.gameState.cards[card2Id];

        if (card1.emoji === card2.emoji) {
            // 매치 성공
            card1.isMatched = true;
            card2.isMatched = true;
            this.gameState.matchedPairs++;

            const card1Element = document.querySelector(`[data-card-id="${card1Id}"]`);
            const card2Element = document.querySelector(`[data-card-id="${card2Id}"]`);
            card1Element.classList.add('matched');
            card2Element.classList.add('matched');

            // 매치 애니메이션
            card1Element.style.animation = 'matchPulse 0.6s ease';
            card2Element.style.animation = 'matchPulse 0.6s ease';

            this.checkGameComplete();
        } else {
            // 매치 실패
            setTimeout(() => {
                card1.isFlipped = false;
                card2.isFlipped = false;

                const card1Element = document.querySelector(`[data-card-id="${card1Id}"]`);
                const card2Element = document.querySelector(`[data-card-id="${card2Id}"]`);

                card1Element.classList.remove('flipped');
                card2Element.classList.remove('flipped');
                card1Element.textContent = '';
                card2Element.textContent = '';
            }, 500);
        }

        this.gameState.flippedCards = [];
        this.updateStats();
    }

    checkGameComplete() {
        const totalPairs = Math.floor(this.gameState.cards.length / 2);
        if (this.gameState.matchedPairs === totalPairs) {
            this.gameState.isGameActive = false;
            this.stopTimer();
            setTimeout(() => this.showGameComplete(), 500);
        }
    }

    showGameComplete() {
        const endTime = Date.now();
        const gameTime = Math.floor((endTime - this.gameState.startTime) / 1000);
        const accuracy = Math.round((this.gameState.matchedPairs / this.gameState.attempts) * 100);
        document.getElementById('finalTime').textContent = this.formatTime(gameTime);
        document.getElementById('finalAttempts').textContent = this.gameState.attempts;
        document.getElementById('accuracy').textContent = accuracy || 0;
        this.gameCompleteModal.classList.add('show');
        // 최고 기록 저장
        this.saveHighScore(gameTime, this.gameState.attempts, accuracy);
    }

    saveHighScore(time, attempts, accuracy) {
        const key = `memoryGame_${this.gameState.level}`;
        const currentBest = localStorage.getItem(key);
        if (!currentBest || attempts < JSON.parse(currentBest).attempts) {
            const record = {time, attempts, accuracy, date: new Date().toISOString()};
            localStorage.setItem(key, JSON.stringify(record));
        }
    }

    startTimer() {
        this.gameState.timer = setInterval(() => {
            if (!this.gameState.isPaused && this.gameState.isGameActive) {
                const elapsed = Math.floor((Date.now() - this.gameState.startTime) / 1000);
                this.timerElement.textContent = this.formatTime(elapsed);
            }
        }, 1000);
    }

    stopTimer() {
        if (this.gameState.timer) {
            clearInterval(this.gameState.timer);
            this.gameState.timer = null;
        }
    }

    formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateStats() {
        this.attemptsElement.textContent = this.gameState.attempts;
        const totalPairs = Math.floor(this.gameState.cards.length / 2);
        this.matchesElement.textContent = `${this.gameState.matchedPairs}/${totalPairs}`;
    }

    togglePause() {
        if (!this.gameState.isGameActive) return;
        this.gameState.isPaused = !this.gameState.isPaused;
        if (this.gameState.isPaused) {
            this.pauseBtn.textContent = '계속하기';
            this.pauseModal.classList.add('show');
        } else {
            this.pauseBtn.textContent = '일시정지';
            this.pauseModal.classList.remove('show');
        }
    }

    restartGame() {
        this.gameCompleteModal.classList.remove('show');
        this.startGame(this.gameState.level);
    }

    showDifficultySelector() {
        this.stopTimer();
        this.gameState.isGameActive = false;
        this.gameState.isPaused = false;
        this.difficultySelector.style.display = 'block';
        this.gameBoard.style.display = 'none';
        this.gameControls.style.display = 'none';
        this.gameCompleteModal.classList.remove('show');
        this.pauseModal.classList.remove('show');
    }

    handleKeyPress(e) {
        switch (e.key) {
            case 'Escape':
                if (this.gameState.isPaused) {
                    this.togglePause();
                } else if (this.gameState.isGameActive) {
                    this.togglePause();
                } else {
                    window.location.href = '../../';
                }
                break;
            case ' ':
                e.preventDefault();
                if (this.gameState.isGameActive) {
                    this.togglePause();
                }
                break;
        }
    }
}

// 게임 초기화
document.addEventListener('DOMContentLoaded', () => {
    const game = new MemoryGame();
    console.log('🧠 메모리 게임이 준비되었습니다!');
    console.log('💡 팁: ESC(일시정지/메인), 스페이스바(일시정지)');
});