// 게임 포털 메인 JavaScript

// 기본 게임 통계 데이터 구조
const defaultGameStats = {
    totalPlays: 0,
    favoriteGame: '-',
    gamePlayCounts: {
        snake: 0,
        memory: 0,
        '2048': 0,
        bullethell: 0,
        sudoku: 0,
        chess: 0
    }
};

let gameStats = { ...defaultGameStats };

// Supabase에서 통계 로드
async function loadGameStats() {
    // supabase 클라이언트는 supabaseClient.js에서 전역으로 설정됩니다.
    if (!window.supabase) {
        console.error('Supabase client not found.');
        updateStatsDisplay();
        return;
    }

    try {
        const { data, error } = await window.supabase
            .from('portal_stats')
            .select('stats')
            .eq('id', 1)
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116: 'exact one row not found'
            throw error;
        }

        if (data && data.stats) {
            // DB에 저장된 값과 기본 구조를 병합하여 새로운 게임이 추가되어도 오류가 없도록 함
            gameStats = {
                ...defaultGameStats,
                ...data.stats,
                gamePlayCounts: {
                    ...defaultGameStats.gamePlayCounts,
                    ...(data.stats.gamePlayCounts || {})
                }
            };
        } else {
            // 데이터가 없는 경우, 기본값으로 DB에 새로 생성
            console.log('No stats found on server, creating initial record.');
            await createInitialStats();
        }
    } catch (error) {
        console.error('Error loading game stats:', error);
    }
    updateStatsDisplay();
}

// 초기 통계 데이터를 DB에 생성
async function createInitialStats() {
    if (!window.supabase) return;
    try {
        const { error } = await window.supabase
            .from('portal_stats')
            .insert({ id: 1, stats: defaultGameStats });
        if (error) throw error;
        gameStats = { ...defaultGameStats };
    } catch(error) {
        console.error('Error creating initial stats:', error);
    }
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    document.getElementById('totalPlays').textContent = gameStats.totalPlays || 0;
    document.getElementById('favoriteGame').textContent = gameStats.favoriteGame || '-';
}

// 게임 플레이 수 증가 및 Supabase에 저장
async function incrementGamePlay(gameName) {
    if (!gameStats.gamePlayCounts.hasOwnProperty(gameName)) {
        console.warn(`Game "${gameName}" is not tracked in stats.`);
        // 동적으로 게임 추가
        gameStats.gamePlayCounts[gameName] = 0;
    }

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
    
    // 로컬 UI 즉시 업데이트
    updateStatsDisplay();

    // Supabase에 비동기적으로 저장
    if (!window.supabase) return;
    try {
        const { error } = await window.supabase
            .from('portal_stats')
            .update({ stats: gameStats })
            .eq('id', 1);
        if (error) throw error;
    } catch (error) {
        console.error('Error saving game stats:', error);
    }
}

// 게임 이름을 표시용으로 변환
function getGameDisplayName(gameName) {
    const names = {
        'snake': '스네이크',
        'memory': '메모리',
        '2048': '2048',
        'bullethell': '탄막 슈팅',
        'sudoku': '스도쿠',
        'chess': '체스'
    };
    return names[gameName] || gameName;
}

// 게임 카드 클릭 효과
function addClickEffects() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', async function(e) {
            if (this.querySelector('button[disabled]')) {
                e.preventDefault();
                return;
            }
            
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            const href = this.getAttribute('onclick');
            if (!href) return;

            let gameName = null;
            if (href.includes('snake')) gameName = 'snake';
            else if (href.includes('memory')) gameName = 'memory';
            else if (href.includes('2048')) gameName = '2048';
            else if (href.includes('bullethell')) gameName = 'bullethell';
            else if (href.includes('sudoku')) gameName = 'sudoku';
            else if (href.includes('chess')) gameName = 'chess';

            if (gameName) {
                await incrementGamePlay(gameName);
            }
        });
        
        card.addEventListener('mouseenter', function() {
            if (!this.querySelector('button[disabled]')) {
                this.style.transform = 'translateY(-10px)';
            }
        });
        
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
                e.stopPropagation();
                this.style.transform = 'scale(0.9)';
                setTimeout(() => { this.style.transform = ''; }, 100);
            }
        });
    });
}

// 키보드 단축키
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (e.key >= '1' && e.key <= '6') {
            const gameLinks = [
                'games/snake/index.html',
                'games/memory/index.html',
                'games/2048/index.html',
                'games/bullethell/index.html',
                'games/sudoku/index.html',
                'games/chess/index.html'
            ];
            const index = parseInt(e.key) - 1;
            if (gameLinks[index]) {
                // 게임으로 이동하기 전에 통계를 먼저 저장
                const card = document.querySelectorAll('.game-card')[index];
                const href = card.getAttribute('onclick');
                let gameName = null;
                if (href.includes('snake')) gameName = 'snake';
                else if (href.includes('memory')) gameName = 'memory';
                else if (href.includes('2048')) gameName = '2048';
                else if (href.includes('bullethell')) gameName = 'bullethell';
                else if (href.includes('sudoku')) gameName = 'sudoku';
                else if (href.includes('chess')) gameName = 'chess';

                if(gameName) {
                    incrementGamePlay(gameName).then(() => {
                        window.location.href = gameLinks[index];
                    });
                }
            }
        }
    });
}

// 페이지 가시성 변경 감지 (탭 전환 등)
function addVisibilityListener() {
    document.addEventListener('visibilitychange', function() {
        if (document.visibilityState === 'visible') {
            loadGameStats();
        }
    });
}

// 초기화 함수
async function initGamePortal() {
    await loadGameStats();
    addClickEffects();
    addPlayButtonEvents();
    addKeyboardShortcuts();
    addVisibilityListener();
    
    if (gameStats.totalPlays === 0) {
        setTimeout(() => {
            console.log('🎮 게임 포털에 오신 것을 환영합니다!');
            console.log('💡 팁: 숫자 키 1~6로 게임에 바로 이동할 수 있습니다.');
        }, 1000);
    }
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initGamePortal);

// 외부에서 호출 가능한 함수들 (필요시)
window.gamePortal = {
    incrementGamePlay,
    loadGameStats,
};
