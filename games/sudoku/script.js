document.addEventListener('DOMContentLoaded', () => {
    // --- DOM 요소 및 게임 상태 변수 ---
    const boardElement = document.getElementById('sudoku-board');
    const numberPalette = document.getElementById('number-palette');
    const newGameBtn = document.getElementById('new-game-btn');
    const checkBtn = document.getElementById('check-btn');
    const solveBtn = document.getElementById('solve-btn');
    const difficultyBtns = document.querySelectorAll('.difficulty-btn');
    const timerElement = document.querySelector('.timer');
    const winModal = document.getElementById('win-modal');
    const closeModalBtn = document.querySelector('.close-button');
    const finalTimeElement = document.getElementById('final-time');

    const N = 9;
    let board = [];
    let solution = [];
    let selectedCell = null;
    let timerInterval;
    let timeInSeconds = 0;
    let difficulty = 'absolute-beginner';

    // --- 게임 초기화 ---
    function init() {
        createBoard();
        createPalette();
        addEventListeners();
        startNewGame();
    }

    // --- 보드 및 팔레트 생성 ---
    function createBoard() {
        boardElement.innerHTML = '';
        for (let i = 0; i < N * N; i++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = Math.floor(i / N);
            cell.dataset.col = i % N;
            cell.dataset.block = Math.floor(Math.floor(i / N) / 3) * 3 + Math.floor((i % N) / 3);
            boardElement.appendChild(cell);
        }
    }

    function createPalette() {
        numberPalette.innerHTML = '';
        for (let i = 1; i <= N; i++) {
            const btn = document.createElement('button');
            btn.classList.add('number-btn');
            btn.textContent = i;
            numberPalette.appendChild(btn);
        }
        const eraseBtn = document.createElement('button');
        eraseBtn.classList.add('number-btn');
        eraseBtn.textContent = 'X';
        eraseBtn.dataset.action = 'erase';
        numberPalette.appendChild(eraseBtn);
    }

    // --- 새 게임 시작 ---
    function startNewGame() {
        // 1. 완전한 스도쿠 해답 생성
        let baseBoard = Array(N).fill(0).map(() => Array(N).fill(0));
        generateSolution(baseBoard);
        solution = baseBoard.map(row => [...row]);

        // 2. 난이도에 따라 숫자 제거
        board = solution.map(row => [...row]);
        pokeHoles(difficulty);

        // 3. 보드 렌더링 및 타이머 시작
        renderBoard();
        startTimer();
    }

    // --- 스도쿠 생성 알고리즘 (백트래킹) ---
    function generateSolution(grid) {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (grid[i][j] === 0) {
                    let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
                    for (let num of numbers) {
                        if (isValidMove(grid, i, j, num)) {
                            grid[i][j] = num;
                            if (generateSolution(grid)) {
                                return true;
                            }
                            grid[i][j] = 0; // 백트랙
                        }
                    }
                    return false;
                }
            }
        }
        return true;
    }

    function isValidMove(grid, row, col, num) {
        for (let x = 0; x < N; x++) {
            if (grid[row][x] === num || grid[x][col] === num) {
                return false;
            }
        }
        const startRow = row - row % 3, startCol = col - col % 3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (grid[i + startRow][j + startCol] === num) {
                    return false;
                }
            }
        }
        return true;
    }

    function pokeHoles(level) {
        let holes = 0;
        switch (level) {
            case 'absolute-beginner': holes = 20; break;
            case 'beginner':      holes = 35; break;
            case 'intermediate':    holes = 45; break;
            case 'expert':          holes = 55; break;
            case 'god':             holes = 65; break;
            default:                holes = 45; break;
        }

        let attempts = holes;
        while (attempts > 0) {
            let row = Math.floor(Math.random() * N);
            let col = Math.floor(Math.random() * N);
            if (board[row][col] !== 0) {
                board[row][col] = 0;
                attempts--;
            }
        }
    }

    // --- 보드 렌더링 및 UI 업데이트 ---
    function renderBoard() {
        const cells = boardElement.children;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const cellIndex = i * N + j;
                cells[cellIndex].textContent = board[i][j] === 0 ? '' : board[i][j];
                cells[cellIndex].classList.remove('fixed', 'user-input', 'error');
                if (board[i][j] !== 0) {
                    cells[cellIndex].classList.add('fixed');
                }
            }
        }
    }

    function updateHighlights(cell, add = true) {
        const row = cell.dataset.row;
        const col = cell.dataset.col;
        const block = cell.dataset.block;
        const cells = boardElement.children;
        for(let c of cells) {
            if (add && (c.dataset.row === row || c.dataset.col === col || c.dataset.block === block)) {
                c.classList.add('highlighted');
            } else {
                c.classList.remove('highlighted');
            }
        }
    }

    // --- 이벤트 핸들러 ---
    function addEventListeners() {
        boardElement.addEventListener('click', handleCellClick);
        numberPalette.addEventListener('click', handlePaletteClick);
        document.addEventListener('keydown', handleKeyDown);

        newGameBtn.addEventListener('click', startNewGame);
        checkBtn.addEventListener('click', checkSolution);
        solveBtn.addEventListener('click', solveGame);

        difficultyBtns.forEach(btn => btn.addEventListener('click', handleDifficultyChange));

        closeModalBtn.addEventListener('click', () => winModal.style.display = 'none');
        winModal.addEventListener('click', (e) => {
            if (e.target === winModal) winModal.style.display = 'none';
        });
    }

    function handleCellClick(e) {
        const cell = e.target.closest('.cell');
        if (!cell || cell.classList.contains('fixed')) return;

        if (selectedCell) {
            selectedCell.classList.remove('selected');
            updateHighlights(selectedCell, false);
        }
        selectedCell = cell;
        selectedCell.classList.add('selected');
        updateHighlights(selectedCell, true);
    }

    function handlePaletteClick(e) {
        if (!selectedCell) return;
        const target = e.target.closest('.number-btn');
        if (!target) return;

        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        if (target.dataset.action === 'erase') {
            selectedCell.textContent = '';
            board[row][col] = 0;
            selectedCell.classList.remove('user-input', 'error');
        } else {
            const num = parseInt(target.textContent);
            selectedCell.textContent = num;
            board[row][col] = num;
            selectedCell.classList.add('user-input');
        }
        checkWinCondition();
    }

    function handleKeyDown(e) {
        if (!selectedCell) return;
        const row = selectedCell.dataset.row;
        const col = selectedCell.dataset.col;

        if (e.key >= '1' && e.key <= '9') {
            const num = parseInt(e.key);
            selectedCell.textContent = num;
            board[row][col] = num;
            selectedCell.classList.add('user-input');
            checkWinCondition();
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            selectedCell.textContent = '';
            board[row][col] = 0;
            selectedCell.classList.remove('user-input', 'error');
        }
    }

    function handleDifficultyChange(e) {
        difficulty = e.target.dataset.level;
        difficultyBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');
        startNewGame();
    }

    // --- 게임 로직 함수 ---
    function checkSolution() {
        const cells = boardElement.children;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const cellIndex = i * N + j;
                if (!cells[cellIndex].classList.contains('fixed') && board[i][j] !== 0) {
                    if (board[i][j] !== solution[i][j]) {
                        cells[cellIndex].classList.add('error');
                        setTimeout(() => cells[cellIndex].classList.remove('error'), 1000);
                    }
                }
            }
        }
    }

    function solveGame() {
        board = solution.map(row => [...row]);
        const cells = boardElement.children;
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const cellIndex = i * N + j;
                if (!cells[cellIndex].classList.contains('fixed')) {
                    cells[cellIndex].textContent = board[i][j];
                    cells[cellIndex].classList.add('user-input');
                }
            }
        }
        stopTimer();
    }

    function checkWinCondition() {
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                if (board[i][j] === 0 || board[i][j] !== solution[i][j]) {
                    return; // 아직 안 끝남
                }
            }
        }
        // 이겼다!
        stopTimer();
        finalTimeElement.textContent = timerElement.textContent;
        winModal.style.display = 'flex';
    }

    // --- 타이머 함수 ---
    function startTimer() {
        clearInterval(timerInterval);
        timeInSeconds = 0;
        timerElement.textContent = '00:00';
        timerInterval = setInterval(() => {
            timeInSeconds++;
            const minutes = Math.floor(timeInSeconds / 60).toString().padStart(2, '0');
            const seconds = (timeInSeconds % 60).toString().padStart(2, '0');
            timerElement.textContent = `${minutes}:${seconds}`;
        }, 1000);
    }

    function stopTimer() {
        clearInterval(timerInterval);
    }

    // --- 앱 시작 ---
    init();
});
