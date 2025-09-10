document.addEventListener('DOMContentLoaded', () => {
    const difficultyScreen = document.getElementById('difficultyScreen');
    const gameScreen = document.getElementById('gameScreen');
    const boardElement = document.getElementById('game-board');
    const gameInfoElement = document.getElementById('gameMessage');
    const capturedWhiteElement = document.getElementById('captured-white');
    const capturedBlackElement = document.getElementById('captured-black');
    const promotionScreen = document.getElementById('promotionScreen');
    const P = 'pawn', R = 'rook', N = 'knight', B = 'bishop', Q = 'queen', K = 'king';
    const W = 'piece-white', BL = 'piece-black';

    const initialBoard = [
        { piece: R, color: BL }, { piece: N, color: BL }, { piece: B, color: BL }, { piece: Q, color: BL }, { piece: K, color: BL }, { piece: B, color: BL }, { piece: N, color: BL }, { piece: R, color: BL },
        { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL }, { piece: P, color: BL },
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        null, null, null, null, null, null, null, null,
        { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W }, { piece: P, color: W },
        { piece: R, color: W }, { piece: N, color: W }, { piece: B, color: W }, { piece: Q, color: W }, { piece: K, color: W }, { piece: B, color: W }, { piece: N, color: W }, { piece: R, color: W },
    ];

    const pieceSymbols = {
        [W]: {
            [K]: '♔\uFE0E', [Q]: '♕\uFE0E', [R]: '♖\uFE0E', [B]: '♗\uFE0E', [N]: '♘\uFE0E', [P]: '♙\uFE0E'
        },
        [BL]: {
            [K]: '♚\uFE0E', [Q]: '♛\uFE0E', [R]: '♜\uFE0E', [B]: '♝\uFE0E', [N]: '♞\uFE0E', [P]: '♟\uFE0E'
        }
    };

    const pieceValues = { [P]: 1, [N]: 3, [B]: 3, [R]: 5, [Q]: 9, [K]: 100 };

    let boardState = [...initialBoard];
    let selectedPiece = null;
    let selectedPieceElement = null;
    let possibleMoves = [];
    let currentPlayer = W;
    let isGameOver = false;
    let whiteCaptured = [];
    let blackCaptured = [];
    let aiDifficulty = 'beginner';
    let promotionMove = null;
    let castlingRights = {};
    let enPassantTargetSquare = null;

    function renderBoard() {
        boardElement.innerHTML = '';
        boardState.forEach((p, i) => {
            const square = document.createElement('div');
            square.classList.add('square');
            const row = Math.floor(i / 8);
            const col = i % 8;
            if ((row + col) % 2 === 0) {
                square.classList.add('white');
            } else {
                square.classList.add('black');
            }
            square.dataset.index = i;

            if (p) {
                square.classList.add('piece', p.color);
                square.textContent = pieceSymbols[p.color][p.piece];
                square.dataset.piece = `${p.color}-${p.piece}`;
            }

            boardElement.appendChild(square);
        });

        // Highlight king if in check
        const whiteKingIndex = boardState.findIndex(p => p && p.piece === K && p.color === W);
        if (whiteKingIndex !== -1 && isSquareAttacked(whiteKingIndex, BL)) {
            boardElement.querySelector(`[data-index='${whiteKingIndex}']`).classList.add('in-check');
        }
        const blackKingIndex = boardState.findIndex(p => p && p.piece === K && p.color === BL);
        if (blackKingIndex !== -1 && isSquareAttacked(blackKingIndex, W)) {
            boardElement.querySelector(`[data-index='${blackKingIndex}']`).classList.add('in-check');
        }

        addSquareClickListeners();
    }

    function renderCapturedPieces() {
        capturedWhiteElement.innerHTML = '';
        whiteCaptured.forEach(p => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece', p.color);
            pieceElement.textContent = pieceSymbols[p.color][p.piece];
            capturedWhiteElement.appendChild(pieceElement);
        });

        capturedBlackElement.innerHTML = '';
        blackCaptured.forEach(p => {
            const pieceElement = document.createElement('span');
            pieceElement.classList.add('piece', p.color);
            pieceElement.textContent = pieceSymbols[p.color][p.piece];
            capturedBlackElement.appendChild(pieceElement);
        });
    }

    function handleSquareClick(e) {
        if (isGameOver) return;
        const square = e.currentTarget;
        const index = parseInt(square.dataset.index);
        const piece = boardState[index];

        if (selectedPiece) {
            if (square === selectedPieceElement) {
                clearSelection();
                return;
            }
            if (possibleMoves.includes(index)) {
                movePiece(selectedPiece.index, index);
                return;
            }
        }

        if (piece && piece.color === currentPlayer) {
            selectPiece(square, index);
        } else {
            clearSelection();
        }
    }

    function selectPiece(square, index) {
        clearSelection();
        const piece = boardState[index];
        if (!piece) return;

        selectedPiece = { piece, index };
        selectedPieceElement = square;
        square.classList.add('selected');

        possibleMoves = getValidMoves(piece, index);
        highlightPossibleMoves();
    }

    function clearSelection() {
        if (selectedPieceElement) {
            selectedPieceElement.classList.remove('selected');
        }
        selectedPiece = null;
        selectedPieceElement = null;
        clearHighlights();
        possibleMoves = [];
    }

    function highlightPossibleMoves() {
        possibleMoves.forEach(index => {
            const square = boardElement.querySelector(`[data-index='${index}']`);
            if (square) {
                square.classList.add('possible-move');
            }
        });
    }

    function clearHighlights() {
        boardElement.querySelectorAll('.possible-move').forEach(sq => sq.classList.remove('possible-move'));
    }

    function movePiece(from, to) {
        let capturedPiece = boardState[to];

        // Handle En Passant capture
        const piece = boardState[from];
        if (piece.piece === P && to === enPassantTargetSquare) {
            const capturedPawnIndex = to + (piece.color === W ? 8 : -8);
            capturedPiece = boardState[capturedPawnIndex];
            boardState[capturedPawnIndex] = null;
        }

        if (capturedPiece) {
            if (capturedPiece.color === BL) {
                whiteCaptured.push(capturedPiece);
            } else {
                blackCaptured.push(capturedPiece);
            }
        }

        const piece = boardState[from];

        // Handle castling move
        if (piece.piece === K && Math.abs(from - to) === 2) {
            // Kingside castle
            if (to > from) {
                const rook = boardState[to + 1];
                boardState[to - 1] = rook;
                boardState[to + 1] = null;
            }
            // Queenside castle
            else {
                const rook = boardState[to - 2];
                boardState[to + 1] = rook;
                boardState[to - 2] = null;
            }
        }

        // Update castling rights if king or rook moves
        if (piece.piece === K) {
            if (piece.color === W) castlingRights.wKing = false;
            else castlingRights.bKing = false;
        }
        if (piece.piece === R) {
            if (piece.color === W) {
                if (from === 56) castlingRights.wRookA = false;
                if (from === 63) castlingRights.wRookH = false;
            } else {
                if (from === 0) castlingRights.bRookA = false;
                if (from === 7) castlingRights.bRookH = false;
            }
        }

        boardState[to] = piece;
        boardState[from] = null;

        clearSelection();

        // Check for pawn promotion
        const promotionRank = piece.color === W ? 0 : 7;
        const row = Math.floor(to / 8);
        if (piece.piece === P && row === promotionRank) {
            handlePromotion(to, piece.color);
            return; // Pause game until promotion is chosen
        }

        renderBoard();
        renderCapturedPieces();

        // Set en passant target square
        if (piece.piece === P && Math.abs(from - to) === 16) {
            enPassantTargetSquare = (from + to) / 2;
        } else {
            enPassantTargetSquare = null;
        }

        continueGame();
    }

    function handlePromotion(squareIndex, color) {
        promotionMove = { squareIndex, color };
        promotionScreen.classList.remove('hidden');
        // Game is paused, no more moves until a choice is made
    }

    function promotePawn(newPieceType) {
        if (!promotionMove) return;

        const { squareIndex, color } = promotionMove;
        boardState[squareIndex] = { piece: newPieceType, color: color };

        promotionMove = null;
        promotionScreen.classList.add('hidden');

        renderBoard();
        renderCapturedPieces();
        continueGame();
    }

    function continueGame() {
        currentPlayer = (currentPlayer === W) ? BL : W;
        updateGameInfo();

        checkGameOver();

        if (currentPlayer === BL && !isGameOver) {
            setTimeout(aiMove, 1000);
        }
    }

    function checkGameOver() {
        if (isGameOver) return;

        let hasLegalMoves = false;
        for (let i = 0; i < 64; i++) {
            const piece = boardState[i];
            if (piece && piece.color === currentPlayer) {
                const moves = getValidMoves(piece, i);
                if (moves.length > 0) {
                    hasLegalMoves = true;
                    break;
                }
            }
        }

        if (!hasLegalMoves) {
            isGameOver = true;
            const kingIndex = boardState.findIndex(p => p && p.piece === K && p.color === currentPlayer);
            const opponentColor = currentPlayer === W ? BL : W;

            if (isSquareAttacked(kingIndex, opponentColor)) {
                const winner = opponentColor === W ? '백' : '흑';
                gameInfoElement.textContent = `체크메이트! ${winner}의 승리!`;
                alert(`체크메이트! ${winner}의 승리!`);
            } else {
                gameInfoElement.textContent = "스테일메이트! 무승부입니다.";
                alert("스테일메이트! 무승부입니다.");
            }
        }
    }

    function aiMove() {
        const allPossibleMoves = [];
        for (let i = 0; i < 64; i++) {
            const piece = boardState[i];
            if (piece && piece.color === BL) {
                const moves = getValidMoves(piece, i);
                moves.forEach(to => {
                    allPossibleMoves.push({ from: i, to, piece: piece });
                });
            }
        }

        if (allPossibleMoves.length === 0) {
            return; // Should be caught by checkGameOver, but as a safeguard.
        }

        let bestMove;

        switch (aiDifficulty) {
            case 'beginner':
                bestMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
                break;

            case 'intermediate':
                let bestCaptureValue = -1;
                let potentialMoves = [];
                for (const move of allPossibleMoves) {
                    const capturedPiece = boardState[move.to];
                    if (capturedPiece) {
                        const captureValue = pieceValues[capturedPiece.piece];
                        if (captureValue > bestCaptureValue) {
                            bestCaptureValue = captureValue;
                            potentialMoves = [move];
                        } else if (captureValue === bestCaptureValue) {
                            potentialMoves.push(move);
                        }
                    }
                }

                if (potentialMoves.length > 0) {
                    bestMove = potentialMoves[Math.floor(Math.random() * potentialMoves.length)];
                } else {
                    bestMove = allPossibleMoves[Math.floor(Math.random() * allPossibleMoves.length)];
                }
                break;

            case 'expert':
                let bestScore = -Infinity;
                let expertMoves = [];
                for (const move of allPossibleMoves) {
                    let score = 0;
                    // Evaluate captures
                    const capturedPiece = boardState[move.to];
                    if (capturedPiece) {
                        score += pieceValues[capturedPiece.piece];
                    }

                    // Avoid moving into an attacked square
                    const opponentColor = W;
                    if (isSquareAttacked(move.to, opponentColor)) {
                        score -= pieceValues[move.piece.piece] / 2; // Penalize moving to a threatened square
                    }

                    if (score > bestScore) {
                        bestScore = score;
                        expertMoves = [move];
                    } else if (score === bestScore) {
                        expertMoves.push(move);
                    }
                }
                bestMove = expertMoves[Math.floor(Math.random() * expertMoves.length)];
                break;
        }

        movePiece(bestMove.from, bestMove.to);
    }

    function updateGameInfo() {
        if (currentPlayer === W) {
            gameInfoElement.textContent = "플레이어(백)의 차례입니다.";
        } else {
            gameInfoElement.textContent = "AI(흑)의 차례입니다...";
        }
    }

    function isSquareAttacked(squareIndex, attackerColor) {
        for (let i = 0; i < 64; i++) {
            const piece = boardState[i];
            if (piece && piece.color === attackerColor) {
                const moves = getAttackMoves(piece, i);
                if (moves.includes(squareIndex)) {
                    return true;
                }
            }
        }
        return false;
    }

    // Generates attack moves for a piece, which can be different from regular moves (e.g., pawns).
    function getAttackMoves(piece, index) {
        // For king, we calculate raw attack squares without checking their safety to avoid recursion.
        if (piece.piece === K) {
            const moves = [];
            const row = Math.floor(index / 8);
            const col = index % 8;
            const kingMoves = [
                [-1, -1], [-1, 0], [-1, 1], [0, -1],
                [0, 1], [1, -1], [1, 0], [1, 1]
            ];
            for (const [rowOffset, colOffset] of kingMoves) {
                const newRow = row + rowOffset;
                const newCol = col + colOffset;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    moves.push(newRow * 8 + newCol);
                }
            }
            return moves;
        }

        if (piece.piece === P) {
            const moves = [];
            const row = Math.floor(index / 8);
            const col = index % 8;
            const dir = piece.color === W ? -1 : 1;
            const newRow = row + dir;

            if (newRow >= 0 && newRow < 8) {
                if (col > 0) moves.push(newRow * 8 + (col - 1));
                if (col < 7) moves.push(newRow * 8 + (col + 1));
            }
            return moves;
        }

        // For other pieces, their attack squares are the same as their move squares.
        // We pass the board state to handle captures correctly.
        // We can't call getValidMoves here as it would lead to recursion with the king.
        // So we call the specific move functions.
        switch (piece.piece) {
            case R: return getRookMoves(piece, index);
            case N: return getKnightMoves(piece, index);
            case B: return getBishopMoves(piece, index);
            case Q: return getQueenMoves(piece, index);
            default: return [];
        }
    }

    function getValidMoves(piece, index) {
        // This function now generates all "legal" moves, considering checks.
        const pseudoLegalMoves = getPseudoLegalMovesForPiece(piece, index);
        const legalMoves = [];
        const playerColor = piece.color;
        const opponentColor = playerColor === W ? BL : W;

        for (const move of pseudoLegalMoves) {
            // Simulate the move
            const originalDestinationPiece = boardState[move];
            boardState[move] = piece;
            boardState[index] = null;

            // Find the king
            let kingIndex = -1;
            for (let i = 0; i < 64; i++) {
                if (boardState[i] && boardState[i].piece === K && boardState[i].color === playerColor) {
                    kingIndex = i;
                    break;
                }
            }

            // If the king is not attacked after the move, it's a legal move
            if (kingIndex !== -1 && !isSquareAttacked(kingIndex, opponentColor)) {
                legalMoves.push(move);
            }

            // Revert the move
            boardState[index] = piece;
            boardState[move] = originalDestinationPiece;
        }
        return legalMoves;
    }

    function getPseudoLegalMovesForPiece(piece, index) {
        switch (piece.piece) {
            case P: return getPawnMoves(piece, index);
            case R: return getRookMoves(piece, index);
            case N: return getKnightMoves(piece, index);
            case B: return getBishopMoves(piece, index);
            case Q: return getQueenMoves(piece, index);
            case K: return getKingMoves(piece, index);
            default: return [];
        }
    }

    function getPawnMoves(piece, index) {
        const moves = [];
        const row = Math.floor(index / 8);
        const col = index % 8;
        const dir = piece.color === W ? -1 : 1;
        const startRow = piece.color === W ? 6 : 1;

        // Forward 1
        const oneStep = index + 8 * dir;
        if (row + dir >= 0 && row + dir < 8 && !boardState[oneStep]) {
            moves.push(oneStep);
            // Forward 2 from start
            if (row === startRow) {
                const twoSteps = index + 16 * dir;
                if (!boardState[twoSteps]) {
                    moves.push(twoSteps);
                }
            }
        }
        // Capture
        const cap1 = index + 8 * dir - 1;
        if (col > 0 && boardState[cap1] && boardState[cap1].color !== piece.color) {
            moves.push(cap1);
        }
        const cap2 = index + 8 * dir + 1;
        if (col < 7 && boardState[cap2] && boardState[cap2].color !== piece.color) {
            moves.push(cap2);
        }

        // En Passant
        if (enPassantTargetSquare) {
            if (cap1 === enPassantTargetSquare && col > 0) moves.push(cap1);
            if (cap2 === enPassantTargetSquare && col < 7) moves.push(cap2);
        }

        return moves;
    }

    function getRookMoves(piece, index) {
        return getSlidingMoves(piece, index, [[-1, 0], [1, 0], [0, -1], [0, 1]]);
    }

    function getBishopMoves(piece, index) {
        return getSlidingMoves(piece, index, [[-1, -1], [-1, 1], [1, -1], [1, 1]]);
    }

    function getQueenMoves(piece, index) {
        return getSlidingMoves(piece, index, [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]]);
    }

    function getSlidingMoves(piece, index, directions) {
        const moves = [];
        const startRow = Math.floor(index / 8);
        const startCol = index % 8;

        for (const [rowDir, colDir] of directions) {
            for (let i = 1; i < 8; i++) {
                const row = startRow + i * rowDir;
                const col = startCol + i * colDir;
                if (row < 0 || row >= 8 || col < 0 || col >= 8) break;

                const targetIndex = row * 8 + col;
                const targetPiece = boardState[targetIndex];

                if (targetPiece) {
                    if (targetPiece.color !== piece.color) {
                        moves.push(targetIndex);
                    }
                    break;
                } else {
                    moves.push(targetIndex);
                }
            }
        }

        // Castling logic
        if (!isSquareAttacked(index, opponentColor)) { // Can't castle out of check
            if (piece.color === W) {
                // Kingside
                if (castlingRights.wKing && castlingRights.wRookH && !boardState[61] && !boardState[62] &&
                    !isSquareAttacked(61, opponentColor) && !isSquareAttacked(62, opponentColor)) {
                    moves.push(62);
                }
                // Queenside
                if (castlingRights.wKing && castlingRights.wRookA && !boardState[59] && !boardState[58] && !boardState[57] &&
                    !isSquareAttacked(59, opponentColor) && !isSquareAttacked(58, opponentColor)) {
                    moves.push(58);
                }
            } else { // Black
                // Kingside
                if (castlingRights.bKing && castlingRights.bRookH && !boardState[5] && !boardState[6] &&
                    !isSquareAttacked(5, opponentColor) && !isSquareAttacked(6, opponentColor)) {
                    moves.push(6);
                }
                // Queenside
                if (castlingRights.bKing && castlingRights.bRookA && !boardState[3] && !boardState[2] && !boardState[1] &&
                    !isSquareAttacked(3, opponentColor) && !isSquareAttacked(2, opponentColor)) {
                    moves.push(2);
                }
            }
        }

        return moves;
    }

    function getKnightMoves(piece, index) {
        const moves = [];
        const row = Math.floor(index / 8);
        const col = index % 8;
        const knightMoves = [
            [-2, -1], [-2, 1], [-1, -2], [-1, 2],
            [1, -2], [1, 2], [2, -1], [2, 1]
        ];

        for (const [rowOffset, colOffset] of knightMoves) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetIndex = newRow * 8 + newCol;
                const targetPiece = boardState[targetIndex];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    moves.push(targetIndex);
                }
            }
        }
        return moves;
    }

    function getKingMoves(piece, index) {
        const moves = [];
        const row = Math.floor(index / 8);
        const col = index % 8;
        const opponentColor = piece.color === W ? BL : W;
        const kingMoves = [
            [-1, -1], [-1, 0], [-1, 1], [0, -1],
            [0, 1], [1, -1], [1, 0], [1, 1]
        ];

        for (const [rowOffset, colOffset] of kingMoves) {
            const newRow = row + rowOffset;
            const newCol = col + colOffset;
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                const targetIndex = newRow * 8 + newCol;
                const targetPiece = boardState[targetIndex];
                if (!targetPiece || targetPiece.color !== piece.color) {
                    // Temporarily move king to check if the destination is safe
                    const originalPiece = boardState[targetIndex];
                    boardState[targetIndex] = piece;
                    boardState[index] = null;

                    if (!isSquareAttacked(targetIndex, opponentColor)) {
                        moves.push(targetIndex);
                    }

                    // Revert the temporary move
                    boardState[index] = piece;
                    boardState[targetIndex] = originalPiece;
                }
            }
        }
        return moves;
    }

    function addSquareClickListeners() {
        const squares = boardElement.querySelectorAll('.square');
        squares.forEach(sq => sq.addEventListener('click', handleSquareClick));
    }

    function setupGame(level) {
        aiDifficulty = level;
        difficultyScreen.classList.add('hidden');
        gameScreen.classList.remove('hidden');

        boardState = initialBoard.map(p => p ? {...p} : null);
        currentPlayer = W;
        isGameOver = false;
        whiteCaptured = [];
        blackCaptured = [];
        castlingRights = { wKing: true, bKing: true, wRookA: true, wRookH: true, bRookA: true, bRookH: true };
        enPassantTargetSquare = null;
        clearSelection();
        renderBoard();
        renderCapturedPieces();
        updateGameInfo();
    }

    function resetGame() {
        gameScreen.classList.add('hidden');
        difficultyScreen.classList.remove('hidden');
    }

    function init() {
        document.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                setupGame(btn.dataset.level);
            });
        });
        document.getElementById('newGameBtn').addEventListener('click', resetGame);

        document.querySelectorAll('.promotion-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                promotePawn(btn.dataset.piece);
            });
        });
    }

    init();
});
