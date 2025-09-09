// 메모리 게임 준비중 페이지 JavaScript

// 알림 받기 기능
function showNotification() {
    // 로컬 스토리지에 알림 설정 저장
    localStorage.setItem('memoryGameNotification', 'true');
    
    // 사용자에게 알림
    alert('🔔 메모리 게임 출시 알림이 설정되었습니다!\n게임이 완성되면 메인 페이지에서 알려드릴게요.');
    
    // 버튼 텍스트 변경
    const button = document.querySelector('.notify-btn');
    button.textContent = '✅ 알림 설정됨';
    button.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
    button.disabled = true;
}

// 미리보기 카드 클릭 효과
function initPreviewCards() {
    const cards = document.querySelectorAll('.preview-card');
    
    cards.forEach(card => {
        card.addEventListener('click', function() {
            if (!this.classList.contains('flipped')) {
                // 카드 뒤집기 효과
                this.style.transform = 'rotateY(180deg)';
                
                setTimeout(() => {
                    this.classList.add('flipped');
                    this.textContent = getRandomEmoji();
                    this.style.transform = 'rotateY(0deg)';
                }, 150);
                
                // 3초 후 다시 뒤집기
                setTimeout(() => {
                    this.style.transform = 'rotateY(180deg)';
                    setTimeout(() => {
                        this.classList.remove('flipped');
                        this.textContent = '❓';
                        this.style.transform = 'rotateY(0deg)';
                    }, 150);
                }, 3000);
            }
        });
    });
}

// 랜덤 이모지 가져오기
function getRandomEmoji() {
    const emojis = ['🎭', '🎨', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻', '🎹', '🎤', '🎧', '🎮', '🎯', '🎊', '🎉'];
    return emojis[Math.floor(Math.random() * emojis.length)];
}

// 진행률 애니메이션
function animateProgress() {
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');
    
    let progress = 0;
    const targetProgress = 15;
    
    const interval = setInterval(() => {
        progress += 1;
        progressFill.style.width = progress + '%';
        progressText.textContent = progress + '% 완료';
        
        if (progress >= targetProgress) {
            clearInterval(interval);
        }
    }, 50);
}

// 개발 로그 시뮬레이션
function showDevelopmentLog() {
    const logs = [
        '🎨 카드 디자인 시작...',
        '⚡ 게임 로직 구현 중...',
        '🎵 사운드 효과 추가 예정...',
        '📱 모바일 최적화 진행 중...',
        '🐛 버그 수정 및 테스트 중...'
    ];
    
    let currentLog = 0;
    
    console.log('🚧 메모리 게임 개발 로그:');
    
    setInterval(() => {
        if (currentLog < logs.length) {
            console.log(logs[currentLog]);
            currentLog++;
        }
    }, 2000);
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
        
        // 숫자 1: 스네이크 게임으로
        if (e.key === '1') {
            window.location.href = '../snake/snake_game.html';
        }
    });
}

// 페이지 로드시 기존 알림 설정 확인
function checkExistingNotification() {
    if (localStorage.getItem('memoryGameNotification') === 'true') {
        const button = document.querySelector('.notify-btn');
        button.textContent = '✅ 알림 설정됨';
        button.style.background = 'linear-gradient(45deg, #00b894, #00cec9)';
        button.disabled = true;
    }
}

// 재미있는 카운트다운 (가짜)
function startCountdown() {
    const descriptions = document.querySelectorAll('.description p');
    const messages = [
        '개발자가 열심히 코딩 중입니다... 🔥',
        '카드를 뒤집어서 같은 그림을 찾는 기억력 게임이 준비중입니다.',
        '최소 횟수로 모든 카드를 맞춰보세요!',
        '곧 여러분을 만날 수 있을 거예요! 🎉'
    ];
    
    let currentMessage = 0;
    
    setInterval(() => {
        if (descriptions[0] && messages[currentMessage]) {
            descriptions[0].textContent = messages[currentMessage];
            currentMessage = (currentMessage + 1) % messages.length;
        }
    }, 4000);
}

// 초기화 함수
function initMemoryComingSoon() {
    checkExistingNotification();
    initPreviewCards();
    animateProgress();
    addKeyboardShortcuts();
    showDevelopmentLog();
    startCountdown();
    
    // 환영 메시지
    console.log('🧠 메모리 게임 준비중 페이지에 오신 것을 환영합니다!');
    console.log('💡 팁: 스페이스바로 알림 설정, ESC로 메인으로, 1번키로 스네이크 게임!');
}

// 페이지 로드시 초기화
document.addEventListener('DOMContentLoaded', initMemoryComingSoon);