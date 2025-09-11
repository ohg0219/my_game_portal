// 게임 포털 메인 JavaScript

// 기본 게임 통계 데이터 구조
const defaultGameStats = {
    totalPlays: 0,
    favoriteGame: '-',
    gamePlayCounts: {}
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

        // "No rows found"는 에러가 아니므로 정상 처리
        if (error && error.code !== 'PGRST116') {
            throw error;
        }

        // 데이터가 성공적으로 로드되면, 로컬 상태 업데이트
        if (data && data.stats) {
            gameStats = {
                ...defaultGameStats,
                ...data.stats,
                gamePlayCounts: {
                    ...defaultGameStats.gamePlayCounts,
                    ...(data.stats.gamePlayCounts || {})
                }
            };
        }
        // 에러가 발생해도 (예: 행이 없음) 기본 통계로 UI를 그냥 표시

    } catch (error) {
        console.error('Error loading game stats:', error);
    }
    updateStatsDisplay();
}

// 통계 표시 업데이트
function updateStatsDisplay() {
    document.getElementById('totalPlays').textContent = gameStats.totalPlays || 0;
    document.getElementById('favoriteGame').textContent = gameStats.favoriteGame || '-';
}

// 클릭/이동 처리 및 통계 전송
function handleGameNavigation(cardElement) {
    if (!cardElement) return;

    const gameName = cardElement.dataset.game;
    const href = cardElement.dataset.href;

    if (gameName && href) {
        // Edge Function URL 가져오기
        const functionUrl = `${window.supabase.functionsUrl}/update-stats`;

        // sendBeacon으로 데이터 전송
        const payload = { gameName: gameName };
        const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' });

        // sendBeacon은 페이지를 떠나도 데이터 전송을 보장함
        if (navigator.sendBeacon) {
            navigator.sendBeacon(functionUrl, blob);
        } else {
            // sendBeacon을 지원하지 않는 구형 브라우저를 위한 폴백 (UX 저하 발생)
            fetch(functionUrl, {
                method: 'POST',
                body: blob,
                keepalive: true
            });
        }

        // 즉시 페이지 이동
        window.location.href = href;
    }
}

// 게임 카드 클릭 효과
function addClickEffects() {
    document.querySelectorAll('.game-card').forEach(card => {
        card.addEventListener('click', function(e) {
            if (this.querySelector('button[disabled]')) return;
            if (e.target.tagName === 'A') return;
            handleGameNavigation(this);
        });

        card.addEventListener('mouseenter', function() {
            if (!this.querySelector('button[disabled]')) {
                this.style.transition = 'transform 0.2s ease-out';
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
            e.preventDefault();
            if (this.disabled) return;
            const card = this.closest('.game-card');
            handleGameNavigation(card);
        });
    });
}

// 키보드 단축키
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
        if (e.key >= '1' && e.key <= '6') {
            e.preventDefault();
            const index = parseInt(e.key) - 1;
            const card = document.querySelectorAll('.game-card')[index];
            if (card && !card.querySelector('button[disabled]')) {
                handleGameNavigation(card);
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
    loadGameStats,
};
