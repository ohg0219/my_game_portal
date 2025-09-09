// 2048 게임 준비중 페이지 JavaScript

// 알림 받기 기능
function showNotification() {
    // 로컬 스토리지에 알림 설정 저장
    localStorage.setItem('2048GameNotification', 'true');
    
    // 사용자에게 알림
    alert('🔔 2048 게임 출시 알림이 설정되었습니다!\n게임이 완성되면 메인 페이지에서 알려드릴게요.');
    
    // 버튼 텍스트 변경
    const button = document.querySelector('.notify-btn');
    button.textContent = '✅ 알림 설정됨';
    button.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
    button.disabled = true;
}

// 타일 클릭 효과
function initTileEffects() {
    const tiles = document.querySelectorAll('.tile:not(.empty)');
    
    tiles.forEach(tile => {
        tile.addEventListener('click', function() {
            // 타일 값 가져오기
            const value = parseInt(this.textContent);
            
            // 클릭 효과
            this.style.transform = 'scale(1.1)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);
            
            // 2048 타일 특별 효과
            if (value === 2048) {
                this.style.animation = 'glow 0.5s ease-in-out';
                setTimeout(() => {
                    this.style.animation = 'glow 2s infinite';
                }, 500);
                
                showCongratulations();
            }
            
            // 숫자 변화 시뮬레이션 (데모용)
            if (value < 1024) {
                setTimeout(() => {
                    const nextValue = value * 2;
                    this.textContent = nextValue;
                    this.className = `tile tile-${nextValue}`;
                    
                    // 3초 후 원복
                    setTimeout(() => {
                        this.textContent = value;
                        this.className = `tile tile-${value}`;
                    }, 3000);
                }, 500);
            }
        });
    });
}

// 2048 달성 축하 메시지
function showCongratulations() {
    const congratsMsg = document.createElement('div');
    congratsMsg.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #edc22e, #f7931e);
        color: white;
        padding: 20px 30px;
        border-radius: 15px;
        font-size: 1.2rem;
        font-weight: bold;
        z-index: 1000;
        animation: bounce 0.5s ease-in-out;
        box-shadow: 0 8px 32px rgba(0,0,0,0.3);
    `;
    congratsMsg.textContent = '🎉 2048 달성! (미리보기)';
    
    document.body.appendChild(congratsMsg);
    
    setTimeout(() => {
        document.body.removeChild(congratsMsg);
    }, 2000);
}

// 진행률 애니메이션
function animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let progress = 0;
    const targetProgress = 25;
    
    const interval = setInterval(() => {
        progress += 1;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '% 완료';
        
        if (progress >= targetProgress) {
            clearInterval(interval);
        }
    }, 50);
}

// 개발 진행률 업데이트
function updateProgressItems() {
    const progressItems = document.querySelectorAll('.progress-item');
    
    // 순차적으로 상태 변경 시뮬레이션
    setTimeout(() => {
        if (progressItems[1]) {
            progressItems[1].classList.remove('in-progress');
            progressItems[1].classList.add('completed');
            progressItems[1].innerHTML = '✅ 게임 로직 구현';
        }
    }, 3000);
    
    setTimeout(() => {
        if (progressItems[2]) {
            progressItems[2].classList.remove('pending');
            progressItems[2].classList.add('in-progress');
            progressItems[2].innerHTML = '🔄 애니메이션 효과';
        }
    }, 6000);
}

// 개발자 노트 업데이트
function updateDeveloperNotes() {
    const today = new Date();
    const dateStr = today.getFullYear() + '.' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '.' + 
                   String(today.getDate()).padStart(2, '0');
    
    const newNotes = [
        { date: dateStr, text: '타일 병합 로직 구현 완료' },
        { date: dateStr, text: '키보드 입력 처리 추가' },
        { date: dateStr, text: '모바일 터치 이벤트 최적화 중...' }
    ];
    
    let noteIndex = 0;
    const interval = setInterval(() => {
        if (noteIndex < newNotes.length) {
            addDeveloperNote(newNotes[noteIndex]);
            noteIndex++;
        } else {
            clearInterval(interval);
        }
    }, 4000);
}

// 개발자 노트 추가
function addDeveloperNote(note) {
    const devNotes = document.querySelector('.dev-notes');
    const noteItem = document.createElement('div');
    noteItem.className = 'note-item';
    noteItem.style.opacity = '0';
    noteItem.style.transform = 'translateY(20px)';
    
    noteItem.innerHTML = `
        <span class="note-date">${note.date}</span>
        <span class="note-text">${note.text}</span>
    `;
    
    devNotes.appendChild(noteItem);
    
    // 애니메이션 효과
    setTimeout(() => {
        noteItem.style.transition = 'all 0.5s ease';
        noteItem.style.opacity = '1';
        noteItem.style.transform = 'translateY(0)';
    }, 100);
}

// 키보드 단축키
function addKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // ESC: 메인 페이지로
        if (e.key === 'Escape') {
            window.location.href = '../../';
        }
        
        // 스페이스바: 알림 설정
        if (e.key === ' ') {
            e.preventDefault();
            showNotification();
        }
        
        // 방향키: 게임 조작 미리보기
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
            e.preventDefault();
            showDirectionPreview(e.key);
        }
        
        // 숫자 1: 스네이크 게임으로
        if (e.key === '1') {
            window.location.href = '../snake/snake_game.html';
        }
        
        // 숫자 2: 메모리 게임으로
        if (e.key === '2') {
            window.location.href = '../memory/index.html';
        }
    });
}

// 방향키 미리보기
function showDirectionPreview(direction) {
    const directionMap = {
        'ArrowUp': '위로 스와이프',
        'ArrowDown': '아래로 스와이프', 
        'ArrowLeft': '왼쪽으로 스와이프',
        'ArrowRight': '오른쪽으로 스와이프'
    };
    
    const preview = document.createElement('div');
    preview.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(255, 107, 53, 0.9);
        color: white;
        padding: 10px 15px;
        border-radius: 10px;
        font-size: 0.9rem;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    preview.textContent = `🎮 ${directionMap[direction]}`;
    
    document.body.appendChild(preview);
    
    setTimeout(() => {
        document.body.removeChild(preview);
    }, 1500);
}

// 타일 색상 미리보기
function showTileColorDemo() {
    const tiles = document.querySelectorAll('.tile:not(.empty)');
    let currentIndex = 0;
    
    const interval = setInterval(() => {
        // 이전 타일 원복
        if (currentIndex > 0) {
            tiles[currentIndex - 1].style.transform = 'scale(1)';
        } else if (currentIndex === 0 && tiles.length > 0) {
            tiles[tiles.length - 1].style.transform = 'scale(1)';
        }
        
        // 현재 타일 강조
        if (tiles[currentIndex]) {
            tiles[currentIndex].style.transform = 'scale(1.1)';
            tiles[currentIndex].style.transition = 'transform 0.3s ease';
        }
        
        currentIndex = (currentIndex + 1) % tiles.length;
    }, 800);
    
    // 10초 후 중지
    setTimeout(() => {
        clearInterval(interval);
        tiles.forEach(tile => {
            tile.style.transform = 'scale(1)';
        });
    }, 10000);
}

// 페이지 로드시 기존 알림 설정 확인
function checkExistingNotification() {
    if (localStorage.getItem('2048GameNotification') === 'true') {
        const button = document.querySelector('.notify-btn');
        button.textContent = '✅ 알림 설정됨';
        button.style.background = 'linear-gradient(45deg, #4caf50, #45a049)';
        button.disabled = true;
    }
}

// 게임 통계 시뮬레이션
function simulateGameStats() {
    console.log('📊 2048 게임 개발 통계:');
    console.log('💻 코드 라인 수: 1,247줄');
    console.log('🎨 디자인 완성도: 85%');
    console.log('🐛 발견된 버그: 3개');
    console.log('✅ 해결된 버그: 2개');
    console.log('⏱️ 예상 완성 시간: 2-3일');
}

// 초기화 함수
function init2048ComingSoon() {
    checkExistingNotification();
    initTileEffects();
    animateProgress();
    updateProgressItems();
    addKeyboardShortcuts();
    simulateGameStats();
    
    // 지연 실행 함수들
    setTimeout(() => {
        showTileColorDemo();
    }, 2000);
    
    setTimeout(() => {
        updateDeveloperNotes();
    }, 5000);
    
    // 환영 메시지
    console.log('🔢 2048 게임 준비중 페이지에 오신 것을 환영합니다!');
    console.log('💡 팁: 방향키로 게임 조작 미리보기, 스페이스바로 알림 설정!');
    console.log('🎯 타일을 클릭해서 미리보기를 체험해보세요!');
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', init2048ComingSoon);

// CSS 애니메이션 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
`;
document.head.appendChild(style);