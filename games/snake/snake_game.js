class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.tileCount = this.canvas.width / this.gridSize;
        
        // 게임 상태
        this.snake = [{ x: 10, y: 10 }];
        this.food = {};
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        
        // 난이도 설정
        this.difficulties = {
            beginner: { name: '초보', speed: 200 },
            intermediate: { name: '중수', speed: 150 },
            expert: { name: '고수', speed: 100 },
            master: { name: '신', speed: 70 }
        };
        
        this.currentDifficulty = 'beginner';
        this.gameLoop = null;
        
        // 최고 점수 시스템
        this.highScores = this.loadHighScores();
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    // 최고 점수 로드
    loadHighScores() {
        const saved = localStorage.getItem('snakeGameHighScores');
        if (saved) {
            return JSON.parse(saved);
        }
        
        // 기본값
        return {
            beginner: 0,
            intermediate: 0,
            expert: 0,
            master: 0
        };
    }
    
    // 최고 점수 저장
    saveHighScores() {
        localStorage.setItem('snakeGameHighScores', JSON.stringify(this.highScores));
    }
    
    // 최고 점수 업데이트
    updateHighScore() {
        if (this.score > this.highScores[this.currentDifficulty]) {
            this.highScores[this.currentDifficulty] = this.score;
            this.saveHighScores();
            return true; // 새 기록 달성
        }
        return false;
    }
    
    // 최고 점수 표시 업데이트
    updateHighScoreDisplay() {
        const currentHighScore = this.highScores[this.currentDifficulty];
        const highScoreElement = document.getElementById('highScore');
        if (highScoreElement) {
            highScoreElement.textContent = currentHighScore;
        }
    }
    
    initializeGame() {
        this.showScreen('difficultyScreen');
        this.generateFood();
        this.updateDifficultyHighScores();
    }
    
    // 난이도 선택 화면에 최고 점수 표시
    updateDifficultyHighScores() {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            const level = btn.dataset.level;
            const highScore = this.highScores[level];
            
            // 기존 최고 점수 표시 제거
            const existingHighScore = btn.querySelector('.high-score-display');
            if (existingHighScore) {
                existingHighScore.remove();
            }
            
            // 새 최고 점수 표시 추가
            if (highScore > 0) {
                const highScoreDiv = document.createElement('div');
                highScoreDiv.className = 'high-score-display';
                highScoreDiv.style.cssText = 'font-size: 0.8rem; color: #FFD700; margin-top: 5px;';
                highScoreDiv.textContent = `최고 점수: ${highScore}`;
                btn.appendChild(highScoreDiv);
            }
        });
    }
    
    setupEventListeners() {
        // 난이도 선택 버튼
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.currentDifficulty = e.currentTarget.dataset.level;
                this.startGame();
            });
        });
        
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning || this.gamePaused) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                    break;
                case 'ArrowDown':
                    if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                    break;
                case 'ArrowLeft':
                    if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                    break;
                case 'ArrowRight':
                    if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                    break;
            }
        });
        
        // 화면 방향키 버튼
        document.querySelectorAll('.arrow-key').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!this.gameRunning || this.gamePaused) return;
                
                const direction = e.target.dataset.direction;
                switch(direction) {
                    case 'up':
                        if (this.dy === 0) { this.dx = 0; this.dy = -1; }
                        break;
                    case 'down':
                        if (this.dy === 0) { this.dx = 0; this.dy = 1; }
                        break;
                    case 'left':
                        if (this.dx === 0) { this.dx = -1; this.dy = 0; }
                        break;
                    case 'right':
                        if (this.dx === 0) { this.dx = 1; this.dy = 0; }
                        break;
                }
            });
        });
        
        // 일시정지 버튼
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        // 재시작 버튼
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.resetGame();
            this.startGame();
        });
        
        // 난이도 변경 버튼
        document.getElementById('changeDifficultyBtn').addEventListener('click', () => {
            this.resetGame();
            this.updateDifficultyHighScores();
            this.showScreen('difficultyScreen');
        });
        
        // 최고 점수 초기화 버튼 (숨겨진 기능)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'R') {
                if (confirm('모든 최고 점수를 초기화하시겠습니까?')) {
                    this.resetAllHighScores();
                }
            }
        });
    }
    
    // 모든 최고 점수 초기화
    resetAllHighScores() {
        this.highScores = {
            beginner: 0,
            intermediate: 0,
            expert: 0,
            master: 0
        };
        this.saveHighScores();
        this.updateDifficultyHighScores();
        this.updateHighScoreDisplay();
        alert('모든 최고 점수가 초기화되었습니다.');
    }
    
    startGame() {
        this.resetGame();
        this.gameRunning = true;
        this.showScreen('gameScreen');
        this.updateUI();
        this.gameLoop = setInterval(() => this.update(), this.difficulties[this.currentDifficulty].speed);
    }
    
    resetGame() {
        this.snake = [{ x: 10, y: 10 }];
        this.dx = 0;
        this.dy = 0;
        this.score = 0;
        this.gameRunning = false;
        this.gamePaused = false;
        this.generateFood();
        if (this.gameLoop) {
            clearInterval(this.gameLoop);
        }
    }
    
    togglePause() {
        this.gamePaused = !this.gamePaused;
        const pauseBtn = document.getElementById('pauseBtn');
        pauseBtn.textContent = this.gamePaused ? '계속하기' : '일시정지';
    }
    
    update() {
        if (this.gamePaused) return;
        
        this.moveSnake();
        
        if (this.checkCollision()) {
            this.gameOver();
            return;
        }
        
        this.checkFoodCollision();
        this.draw();
    }
    
    moveSnake() {
        const head = { x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy };
        this.snake.unshift(head);
        
        // 음식을 먹지 않았다면 꼬리 제거
        if (head.x !== this.food.x || head.y !== this.food.y) {
            this.snake.pop();
        }
    }
    
    checkCollision() {
        const head = this.snake[0];
        
        // 벽과의 충돌
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            return true;
        }
        
        // 자기 몸과의 충돌
        for (let i = 1; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                return true;
            }
        }
        
        return false;
    }
    
    checkFoodCollision() {
        const head = this.snake[0];
        
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.generateFood();
            this.updateUI();
            
            // 파티클 효과 (선택사항)
            this.createFoodParticles(this.food.x * this.gridSize, this.food.y * this.gridSize);
        }
    }
    
    // 간단한 파티클 효과
    createFoodParticles(x, y) {
        // 여기에 파티클 효과 코드를 추가할 수 있습니다
        // 현재는 간단한 애니메이션으로 대체
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // 점수 증가 텍스트 표시
        ctx.save();
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'center';
        ctx.fillText('+10', x + this.gridSize/2, y - 10);
        ctx.restore();
    }
    
    generateFood() {
        do {
            this.food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === this.food.x && segment.y === this.food.y));
    }
    
    draw() {
        // 배경 그리기
        this.ctx.fillStyle = 'rgba(0, 20, 0, 0.8)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 격자 그리기
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 1;
        for (let i = 0; i <= this.tileCount; i++) {
            this.ctx.beginPath();
            this.ctx.moveTo(i * this.gridSize, 0);
            this.ctx.lineTo(i * this.gridSize, this.canvas.height);
            this.ctx.stroke();
            
            this.ctx.beginPath();
            this.ctx.moveTo(0, i * this.gridSize);
            this.ctx.lineTo(this.canvas.width, i * this.gridSize);
            this.ctx.stroke();
        }
        
        // 뱀 그리기
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // 머리
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.shadowColor = '#4CAF50';
                this.ctx.shadowBlur = 10;
            } else {
                // 몸통
                this.ctx.fillStyle = '#8BC34A';
                this.ctx.shadowBlur = 5;
            }
            
            this.ctx.fillRect(
                segment.x * this.gridSize + 1,
                segment.y * this.gridSize + 1,
                this.gridSize - 2,
                this.gridSize - 2
            );
        });
        
        // 음식 그리기
        this.ctx.fillStyle = '#FF5722';
        this.ctx.shadowColor = '#FF5722';
        this.ctx.shadowBlur = 15;
        this.ctx.beginPath();
        this.ctx.arc(
            this.food.x * this.gridSize + this.gridSize / 2,
            this.food.y * this.gridSize + this.gridSize / 2,
            this.gridSize / 2 - 2,
            0,
            2 * Math.PI
        );
        this.ctx.fill();
        
        // 그림자 초기화
        this.ctx.shadowBlur = 0;
    }
    
    updateUI() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('currentDifficulty').textContent = this.difficulties[this.currentDifficulty].name;
        this.updateHighScoreDisplay();
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        
        // 최고 점수 확인
        const isNewRecord = this.updateHighScore();
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalDifficulty').textContent = this.difficulties[this.currentDifficulty].name;
        document.getElementById('finalHighScore').textContent = this.highScores[this.currentDifficulty];
        
        // 새 기록 달성 시 축하 메시지
        const newRecordElement = document.getElementById('newRecord');
        if (newRecordElement) {
            if (isNewRecord && this.score > 0) {
                newRecordElement.style.display = 'block';
                newRecordElement.textContent = '🎉 새로운 최고 기록 달성! 🎉';
            } else {
                newRecordElement.style.display = 'none';
            }
        }
        
        this.showScreen('gameOverScreen');
        this.updateDifficultyHighScores();
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    new SnakeGame();
});
