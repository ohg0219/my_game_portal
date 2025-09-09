// 2048 게임 JavaScript

class Game2048 {
    constructor() {
        this.board = [];
        this.score = 0;
        this.bestScore = parseInt(localStorage.getItem('2048-best-score') || '0');
        this.size = 4;
        this.gameWon = false;
        this.gameOver = false;
        this.previousStates = [];
        this.canUndo = false;
        
        this.init();
    }
    
    init() {
        this.setupBoard();
        this.setupLayout();
        this.setupEventListeners();
        this.updateDisplay();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
    }
    
    setupBoard() {
        this.board = [];
        for (let i = 0; i < this.size; i++) {
            this.board[i] = [];
            for (let j = 0; j < this.size; j++) {
                this.board[i][j] = 0;
            }
        }
    }
    
    getGameSettings() {
        // 화면 크기에 따른 게임 설정 계산
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isPortrait = screenHeight > screenWidth;
        const containerPadding = 15;
        
        let tileSize, gap, fontSize;
        
        if (isPortrait && screenWidth <= 500) {
            // 세로 모드 - 작은 화면
            tileSize = 65;
            gap = 8;
            fontSize = { normal: 32, medium: 28, small: 22, tiny: 18 };
        } else if (screenWidth <= 480) {
            // 가로 모드 - 작은 화면
            tileSize = 70;
            gap = 10;
            fontSize = { normal: 36, medium: 30, small: 24, tiny: 20 };
        } else if (screenWidth <= 600) {
            // 중간 화면
            tileSize = 80;
            gap = 12;
            fontSize = { normal: 42, medium: 36, small: 28, tiny: 22 };
        } else {
            // 큰 화면 (데스크톱)
            tileSize = 100;
            gap = 15;
            fontSize = { normal: 55, medium: 45, small: 35, tiny: 30 };
        }
        
        // 컨테이너 크기 계산
        const totalSize = (tileSize * 4) + (gap * 3) + (containerPadding * 2);
        
        return {
            tileSize,
            gap,
            fontSize,
            containerPadding,
            totalSize
        };
    }
    
    setupLayout() {
        const settings = this.getGameSettings();
        const gameContainer = document.querySelector('.game-container');
        const gridContainer = document.querySelector('.grid-container');
        const gridRows = document.querySelectorAll('.grid-row');
        const gridCells = document.querySelectorAll('.grid-cell');
        const tileContainer = document.querySelector('.tile-container');
        
        // 게임 컨테이너 크기 설정
        gameContainer.style.width = settings.totalSize + 'px';
        gameContainer.style.height = settings.totalSize + 'px';
        gameContainer.style.padding = settings.containerPadding + 'px';
        
        // 그리드 컨테이너 크기 설정
        const gridSize = settings.totalSize - (settings.containerPadding * 2);
        gridContainer.style.width = gridSize + 'px';
        gridContainer.style.height = gridSize + 'px';
        
        // 그리드 셀 크기 및 간격 설정
        gridRows.forEach((row, rowIndex) => {
            row.style.gap = settings.gap + 'px';
            if (rowIndex < gridRows.length - 1) {
                row.style.marginBottom = settings.gap + 'px';
            }
            // 그리드 로우 크기 설정
            row.style.height = settings.tileSize + 'px';
        });
        
        gridCells.forEach(cell => {
            cell.style.width = settings.tileSize + 'px';
            cell.style.height = settings.tileSize + 'px';
        });
        
        // 타일 컨테이너 위치 설정 (그리드 컨테이너와 동일한 크기)
        tileContainer.style.top = settings.containerPadding + 'px';
        tileContainer.style.left = settings.containerPadding + 'px';
        tileContainer.style.width = gridSize + 'px';
        tileContainer.style.height = gridSize + 'px';
    }
    
    getTileFontSize(value) {
        const { fontSize } = this.getGameSettings();
        
        if (value >= 1024) {
            return fontSize.tiny;
        } else if (value >= 128) {
            return fontSize.small;
        } else if (value >= 16) {
            return fontSize.medium;
        } else {
            return fontSize.normal;
        }
    }
    
    setupEventListeners() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (this.gameOver) return;
            
            switch(e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    e.preventDefault();
                    this.move('up');
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    e.preventDefault();
                    this.move('down');
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    e.preventDefault();
                    this.move('left');
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    e.preventDefault();
                    this.move('right');
                    break;
            }
        });
        
        // 모바일 컨트롤 버튼만 사용
        document.querySelectorAll('.control-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const direction = btn.getAttribute('data-direction');
                this.move(direction);
            });
        });
        
        // 윈도우 리사이즈 이벤트
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.setupLayout();
                this.renderBoard();
            }, 200);
        });
        
        // 방향 변경 이벤트
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.setupLayout();
                this.renderBoard();
            }, 500);
        });
        
        // 게임 컨트롤 버튼
        document.getElementById('new-game-btn').addEventListener('click', () => {
            this.newGame();
        });
        
        document.getElementById('undo-btn').addEventListener('click', () => {
            this.undo();
        });
        
        // 팝업 버튼들
        document.getElementById('try-again-btn').addEventListener('click', () => {
            this.newGame();
            this.hideGameOver();
        });
        
        document.getElementById('keep-playing-btn').addEventListener('click', () => {
            this.hideVictory();
        });
        
        document.getElementById('new-game-victory-btn').addEventListener('click', () => {
            this.newGame();
            this.hideVictory();
        });
        
        document.getElementById('share-btn').addEventListener('click', () => {
            this.shareScore();
        });
    }
    
    addRandomTile() {
        const emptyCells = [];
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    emptyCells.push({row: i, col: j});
                }
            }
        }
        
        if (emptyCells.length > 0) {
            const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
            const value = Math.random() < 0.9 ? 2 : 4;
            this.board[randomCell.row][randomCell.col] = value;
        }
    }
    
    move(direction) {
        if (this.gameOver) return;
        
        this.saveState();
        
        let moved = false;
        
        switch(direction) {
            case 'left':
                moved = this.moveLeft();
                break;
            case 'right':
                moved = this.moveRight();
                break;
            case 'up':
                moved = this.moveUp();
                break;
            case 'down':
                moved = this.moveDown();
                break;
        }
        
        if (moved) {
            // 즉시 새 보드 렌더링
            this.renderBoard();
            
            // 새 타일 추가는 약간 지연
            setTimeout(() => {
                this.addRandomTile();
                this.renderBoard();
                this.updateDisplay();
                this.canUndo = true;
                document.getElementById('undo-btn').disabled = false;
                
                if (this.checkWin() && !this.gameWon) {
                    this.gameWon = true;
                    setTimeout(() => {
                        this.showVictory();
                    }, 300);
                }
                
                if (this.checkGameOver()) {
                    this.gameOver = true;
                    setTimeout(() => {
                        this.showGameOver();
                    }, 300);
                }
            }, 150);
        } else {
            // 움직이지 않았으면 이전 상태 제거
            this.previousStates.pop();
        }
    }
    
    moveLeft() {
        let moved = false;
        
        for (let i = 0; i < this.size; i++) {
            const row = this.board[i].filter(val => val !== 0);
            const merged = [];
            
            for (let j = 0; j < row.length - 1; j++) {
                if (row[j] === row[j + 1] && !merged[j] && !merged[j + 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j + 1, 1);
                    merged[j] = true;
                }
            }
            
            while (row.length < this.size) {
                row.push(0);
            }
            
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] !== row[j]) {
                    moved = true;
                }
                this.board[i][j] = row[j];
            }
        }
        
        return moved;
    }
    
    moveRight() {
        let moved = false;
        
        for (let i = 0; i < this.size; i++) {
            const row = this.board[i].filter(val => val !== 0);
            const merged = [];
            
            for (let j = row.length - 1; j > 0; j--) {
                if (row[j] === row[j - 1] && !merged[j] && !merged[j - 1]) {
                    row[j] *= 2;
                    this.score += row[j];
                    row.splice(j - 1, 1);
                    merged[j] = true;
                }
            }
            
            while (row.length < this.size) {
                row.unshift(0);
            }
            
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] !== row[j]) {
                    moved = true;
                }
                this.board[i][j] = row[j];
            }
        }
        
        return moved;
    }
    
    moveUp() {
        let moved = false;
        
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== 0) {
                    column.push(this.board[i][j]);
                }
            }
            
            const merged = [];
            for (let i = 0; i < column.length - 1; i++) {
                if (column[i] === column[i + 1] && !merged[i] && !merged[i + 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i + 1, 1);
                    merged[i] = true;
                }
            }
            
            while (column.length < this.size) {
                column.push(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== column[i]) {
                    moved = true;
                }
                this.board[i][j] = column[i];
            }
        }
        
        return moved;
    }
    
    moveDown() {
        let moved = false;
        
        for (let j = 0; j < this.size; j++) {
            const column = [];
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== 0) {
                    column.push(this.board[i][j]);
                }
            }
            
            const merged = [];
            for (let i = column.length - 1; i > 0; i--) {
                if (column[i] === column[i - 1] && !merged[i] && !merged[i - 1]) {
                    column[i] *= 2;
                    this.score += column[i];
                    column.splice(i - 1, 1);
                    merged[i] = true;
                }
            }
            
            while (column.length < this.size) {
                column.unshift(0);
            }
            
            for (let i = 0; i < this.size; i++) {
                if (this.board[i][j] !== column[i]) {
                    moved = true;
                }
                this.board[i][j] = column[i];
            }
        }
        
        return moved;
    }
    
    renderBoard() {
        const container = document.getElementById('tile-container');
        const settings = this.getGameSettings();
        
        // 기존 타일들 제거
        container.innerHTML = '';
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] !== 0) {
                    const tile = document.createElement('div');
                    tile.className = `tile tile-${this.board[i][j]}`;
                    tile.textContent = this.board[i][j];
                    tile.setAttribute('data-row', i);
                    tile.setAttribute('data-col', j);
                    tile.setAttribute('data-value', this.board[i][j]);
                    
                    // 정확한 위치 계산
                    const x = j * (settings.tileSize + settings.gap);
                    const y = i * (settings.tileSize + settings.gap);
                    
                    // 타일 스타일 설정
                    tile.style.width = settings.tileSize + 'px';
                    tile.style.height = settings.tileSize + 'px';
                    tile.style.fontSize = this.getTileFontSize(this.board[i][j]) + 'px';
                    tile.style.transform = `translate(${x}px, ${y}px)`;
                    
                    container.appendChild(tile);
                }
            }
        }
    }
    
    updateDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('best-score').textContent = this.bestScore;
        
        if (this.score > this.bestScore) {
            this.bestScore = this.score;
            localStorage.setItem('2048-best-score', this.bestScore);
            document.getElementById('best-score').classList.add('score-pop');
            setTimeout(() => {
                document.getElementById('best-score').classList.remove('score-pop');
            }, 300);
        }
    }
    
    saveState() {
        const state = {
            board: this.board.map(row => [...row]),
            score: this.score,
            gameWon: this.gameWon,
            gameOver: this.gameOver
        };
        this.previousStates.push(state);
        
        // 최대 10개의 이전 상태만 저장
        if (this.previousStates.length > 10) {
            this.previousStates.shift();
        }
    }
    
    undo() {
        if (this.previousStates.length > 0 && this.canUndo) {
            const previousState = this.previousStates.pop();
            this.board = previousState.board;
            this.score = previousState.score;
            this.gameWon = previousState.gameWon;
            this.gameOver = previousState.gameOver;
            
            this.renderBoard();
            this.updateDisplay();
            this.canUndo = false;
            document.getElementById('undo-btn').disabled = true;
        }
    }
    
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 2048) {
                    return true;
                }
            }
        }
        return false;
    }
    
    checkGameOver() {
        // 빈 칸이 있으면 게임 오버가 아님
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.board[i][j] === 0) {
                    return false;
                }
            }
        }
        
        // 인접한 타일과 합칠 수 있으면 게임 오버가 아님
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const current = this.board[i][j];
                
                // 오른쪽 타일 체크
                if (j < this.size - 1 && this.board[i][j + 1] === current) {
                    return false;
                }
                
                // 아래쪽 타일 체크
                if (i < this.size - 1 && this.board[i + 1][j] === current) {
                    return false;
                }
            }
        }
        
        return true;
    }
    
    showGameOver() {
        const overlay = document.getElementById('game-over-overlay');
        const finalScore = document.getElementById('final-score');
        const newRecord = document.getElementById('new-record');
        
        finalScore.textContent = this.score;
        
        if (this.score === this.bestScore && this.score > 0) {
            newRecord.style.display = 'block';
        } else {
            newRecord.style.display = 'none';
        }
        
        overlay.style.display = 'flex';
    }
    
    hideGameOver() {
        document.getElementById('game-over-overlay').style.display = 'none';
    }
    
    showVictory() {
        const overlay = document.getElementById('victory-overlay');
        const victoryScore = document.getElementById('victory-score');
        
        victoryScore.textContent = this.score;
        overlay.style.display = 'flex';
    }
    
    hideVictory() {
        document.getElementById('victory-overlay').style.display = 'none';
    }
    
    shareScore() {
        const text = `2048 게임에서 ${this.score}점을 달성했습니다! 🎉`;
        
        if (navigator.share) {
            navigator.share({
                title: '2048 게임 점수',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback: 클립보드에 복사
            navigator.clipboard.writeText(text + ' ' + window.location.href).then(() => {
                alert('점수가 클립보드에 복사되었습니다!');
            }).catch(() => {
                alert(`점수: ${this.score}점\n이 결과를 친구들과 공유해보세요!`);
            });
        }
    }
    
    newGame() {
        this.score = 0;
        this.gameWon = false;
        this.gameOver = false;
        this.previousStates = [];
        this.canUndo = false;
        
        document.getElementById('undo-btn').disabled = true;
        
        this.setupBoard();
        this.setupLayout();
        this.addRandomTile();
        this.addRandomTile();
        this.renderBoard();
        this.updateDisplay();
        
        this.hideGameOver();
        this.hideVictory();
    }
}

// 게임 시작
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game2048();
    
    // 전역에서 접근 가능하도록
    window.game2048 = game;
    
    console.log('🔢 2048 게임이 시작되었습니다!');
    console.log('💡 조작법: 방향키 또는 WASD로 타일을 이동하세요');
    console.log('🎯 목표: 타일을 합쳐서 2048을 만드세요!');
});