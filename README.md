# 🐍 스네이크 게임

HTML, CSS, JavaScript로 제작된 클래식 스네이크 게임입니다.

## 🎮 게임 플레이

**🔗 [게임 플레이하기](https://ohg0219.github.io/snake_game/)**

## ✨ 주요 기능

### 🎯 4단계 난이도
- **초보**: 천천히 시작해보세요 (200ms)
- **중수**: 적당한 속도로 (150ms)  
- **고수**: 빠른 속도에 도전! (100ms)
- **신**: 극한의 속도! (70ms)

### 🎮 컨트롤
- **키보드**: 방향키(↑↓←→)로 뱀 조종
- **모바일**: 화면의 방향키 버튼 터치
- **일시정지**: 게임 중 일시정지/재개 가능

### 📱 반응형 디자인
- 데스크톱, 태블릿, 모바일 모든 기기에서 플레이 가능
- 터치 스크린 완벽 지원

### 🏆 점수 시스템
- 음식을 먹을 때마다 10점 획득
- 난이도별 최고 점수 기록
- 로컬 저장으로 점수 유지

## 🎲 게임 규칙

1. **목표**: 뱀을 조종하여 빨간 음식을 먹고 점수를 획득하세요
2. **성장**: 음식을 먹을 때마다 뱀의 길이가 늘어납니다
3. **게임 오버**: 
   - 벽에 부딪히면 게임 오버
   - 자신의 몸통에 부딪히면 게임 오버
4. **승리**: 최대한 높은 점수를 달성하세요!

## 🛠️ 기술 스택

- **HTML5**: 게임 구조 및 Canvas API
- **CSS3**: 반응형 디자인 및 애니메이션
- **JavaScript**: 게임 로직 및 상호작용
- **GitHub Pages**: 무료 호스팅

## 📁 프로젝트 구조

```
snake_game/
├── index.html          # 메인 게임 파일
├── snake_game.css      # 스타일시트
├── snake_game.js       # 게임 로직
├── .nojekyll          # Jekyll 비활성화
└── README.md          # 프로젝트 설명
```

## 🚀 로컬 실행 방법

1. 저장소 클론
```bash
git clone https://github.com/ohg0219/snake_game.git
```

2. 디렉토리 이동
```bash
cd snake_game
```

3. 웹 서버로 실행 (예: Live Server, Python 서버 등)
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 패키지 필요)
npx http-server
```

4. 브라우저에서 `http://localhost:8000` 접속

## 🎯 향후 개선 계획

- [ ] 사운드 효과 추가
- [ ] 파워업 아이템 추가
- [ ] 멀티플레이어 모드
- [ ] 리더보드 시스템
- [ ] 다양한 테마
- [ ] 게임 통계 기능

## 🤝 기여하기

1. 이 저장소를 포크하세요
2. 새로운 기능 브랜치를 만드세요 (`git checkout -b feature/새기능`)
3. 변경사항을 커밋하세요 (`git commit -am '새 기능 추가'`)
4. 브랜치에 푸시하세요 (`git push origin feature/새기능`)
5. Pull Request를 열어주세요

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다. 자세한 내용은 [LICENSE](LICENSE) 파일을 참조하세요.

## 📞 연락처

- GitHub: [@ohg0219](https://github.com/ohg0219)
- 프로젝트 링크: [https://github.com/ohg0219/snake_game](https://github.com/ohg0219/snake_game)

---

⭐ 이 프로젝트가 마음에 들으셨다면 별표를 눌러주세요!
