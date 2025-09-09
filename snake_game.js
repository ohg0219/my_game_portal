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
        
        this.initializeGame();
        this.setupEventListeners();
    }
    
    initializeGame() {
        this.showScreen('difficultyScreen');
        this.generateFood();
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
            this.showScreen('difficultyScreen');
        });
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
        }
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
    }
    
    gameOver() {
        this.gameRunning = false;
        clearInterval(this.gameLoop);
        
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalDifficulty').textContent = this.difficulties[this.currentDifficulty].name;
        
        this.showScreen('gameOverScreen');
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