(function () {
  window.BHGame = window.BHGame || {};

  const GameView = (window.BHGame.GameView = function(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.ship;
    this.animationFrameId = null;
  });

  GameView.MOVES = {
    w: [0, -1],
    a: [-1, 0],
    s: [0, 1],
    d: [1, 0],
  };

  GameView.prototype.bindKeyHandlers = function() {
    const ship = this.ship;
    let moveIntervals = {};

    const handleKeyDown = (e) => {
        const move = GameView.MOVES[e.key.toLowerCase()];
        if (move) {
            if (!moveIntervals[e.key.toLowerCase()]) {
                moveIntervals[e.key.toLowerCase()] = setInterval(() => ship.power(move), 50);
            }
        }
    };

    const handleKeyUp = (e) => {
        const key = e.key.toLowerCase();
        if (moveIntervals[key]) {
            clearInterval(moveIntervals[key]);
            delete moveIntervals[key];
        }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    document.querySelectorAll('.control-btn').forEach(btn => {
        const direction = btn.dataset.direction;
        if (direction) {
            const move = GameView.MOVES[direction];
            const startMove = (e) => {
                e.preventDefault();
                if (!moveIntervals[direction]) {
                   moveIntervals[direction] = setInterval(() => ship.power(move), 50);
                }
            }
            const endMove = (e) => {
                e.preventDefault();
                clearInterval(moveIntervals[direction]);
                delete moveIntervals[direction];
            }
            btn.addEventListener('mousedown', startMove);
            btn.addEventListener('touchstart', startMove);
            btn.addEventListener('mouseup', endMove);
            btn.addEventListener('touchend', endMove);
            btn.addEventListener('mouseleave', endMove);
        }
    });

    this.removeKeyHandlers = () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      // a more robust solution would be to remove the mobile listeners too
    }
  };

  GameView.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.stop = function() {
      if (this.animationFrameId) {
          cancelAnimationFrame(this.animationFrameId);
      }
      this.removeKeyHandlers();
  }

  GameView.prototype.displayGameOver = function() {
      const overlay = document.getElementById('game-over-overlay');
      const finalScore = document.getElementById('final-score');
      finalScore.innerText = this.game.score;
      overlay.style.display = 'flex';
  }

  GameView.prototype.animate = function(time) {
    if (this.game.gameOver) {
      this.stop();
      this.displayGameOver();
      return;
    }

    const timeDelta = time - this.lastTime;
    this.game.update(timeDelta / 1000);
    this.game.draw(this.ctx);
    this.lastTime = time;

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  };
})();
