// 게임 포털 메인 JavaScript

// 게임 통계 데이터
let gameStats = {
    totalPlays: 0,
    favoriteGame: '-',
    gamePlayCounts: {
        snake: 0,
        memory: 0,
        '2048': 0
    }
};

// 로컬 저장소에서 통계 로드
function loadGameStats() {
    const saved = localStorage.getItem('gamePortalStats');
    if (saved) {
        gameStats = { ...gameStats, ...JSON.parse(saved) };
    }
    updateStatsDisplay();
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    document.getElementById('totalPlays').textContent = gameStats.totalPlays;
    document.getElementById('favoriteGame').textContent = gameStats.favoriteGame;
}

// 통계 저장
function saveGameStats() {
    localStorage.setItem('gamePortalStats', JSON.stringify(gameStats));
}

// 게임 플레이 수 증가
function incrementGamePlay(gameName) {
    gameStats.totalPlays++;
    gameStats.gamePlayCounts[gameName]++;
    
    // 가장 많이 플레이한 게임 찾기
    let maxPlays = 0;
    let favorite = '-';
    for (const [game, count] of Object.entries(gameStats.gamePlayCounts)) {
        if (count > maxPlays) {
            maxPlays = count;
            favorite = getGameDisplayName(game);
        }
    }
    gameStats.favoriteGame = favorite;
    
    saveGameStats();
    updateStatsDisplay();
}

// 게임 이름을 표시용으로 변환
function getGameDisplayName(gameName) {
    const names = {
        'snake': '스네이크',
        'memory': '메모리',
        '2048': '2048'
    };
    return names[gameName] || gameName;
}

// 게임 카드 클릭 효과
function addClickEffects() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // 비활성화된 카드는 클릭 효과 없음
            if (this.querySelector('button[disabled]')) {
                e.preventDefault();
                return;
            }
            
            // 클릭 효과 애니메이션
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // 게임 플레이 카운트 증가
            const href = this.getAttribute('onclick');
            if (href) {
                if (href.includes('snake')) {
                    incrementGamePlay('snake');
                } else if (href.includes('memory')) {
                    incrementGamePlay('memory');
                } else if (href.includes('2048')) {
                    incrementGamePlay('2048');
                }
            }
        });
        
        // 마우스 엔터 효과
        card.addEventListener('mouseenter', function() {
            if (!this.querySelector('button[disabled]')) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
        // 마우스 리브 효과
        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });
}

// 플레이 버튼 개별 클릭 이벤트
function addPlayButtonEvents() {
    document.querySelectorAll('.play-button').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.disabled) {
                e.stopPropagation(); // 카드 클릭 이벤트 중복 방지
                
                // 버튼 클릭 효과
                this.style.transform = 'scale(0.9)';
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            }
        });
    });
}

// 키보드 단축키
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl + Shift + R: 통계 초기화
        if (e.ctrlKey && e.shiftKey && e.key === 'R') {
            e.preventDefault();
            if (confirm('모든 게임 통계를 초기화하시겠습니까?')) {
                localStorage.removeItem('gamePortalStats');
                gameStats = {
                    totalPlays: 0,
                    favoriteGame: '-',
                    gamePlayCounts: { snake: 0, memory: 0, '2048': 0 }
                };
                updateStatsDisplay();
                alert('통계가 초기화되었습니다.');
            }
        }
        
        // 숫자 키로 게임 바로 이동
        if (e.key >= '1' && e.key <= '3') {
            const gameLinks = [
                'games/snake/snake_game.html',
                'games/memory/index.html',
                'games/2048/index.html'
            ];
            const index = parseInt(e.key) - 1;
            if (gameLinks[index]) {
                window.location.href = gameLinks[index];
            }
        }
    });
}

// 페이지 가시성 변경 감지 (탭 전환 등)
function addVisibilityListener() {
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            // 페이지가 다시 보이면 통계 새로고침
            loadGameStats();
        }
    });
}

// 게임 상태 체크 (다른 탭에서 게임을 플레이했는지)
function checkGameUpdates() {
    // 5초마다 다른 탭에서의 게임 플레이 체크
    setInterval(() => {
        if (document.visibilityState === 'visible') {
            loadGameStats();
        }
    }, 5000);
}

// 초기화 함수
function initGamePortal() {
    loadGameStats();
    addClickEffects();
    addPlayButtonEvents();
    addKeyboardShortcuts();
    addVisibilityListener();
    checkGameUpdates();
    
    // 환영 메시지 (처음 방문시)
    if (gameStats.totalPlays === 0) {
        setTimeout(() => {
            console.log('🎮 게임 포털에 오신 것을 환영합니다!');
            console.log('💡 팁: 숫자 키 1, 2, 3으로 게임에 바로 이동할 수 있습니다.');
            console.log('🔄 Ctrl+Shift+R로 통계를 초기화할 수 있습니다.');
        }, 1000);
    }
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initGamePortal);

// 외부에서 호출 가능한 함수들
window.gamePortal = {
    incrementGamePlay,
    loadGameStats,
    saveGameStats
};