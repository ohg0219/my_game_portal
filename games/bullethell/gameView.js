(function () {
  window.BHGame = window.BHGame || {};

  const GameView = (window.BHGame.GameView = function(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.ship;
    this.animationFrameId = null;
    this.pressedKeys = new Set();
  });

  GameView.MOVES = {
    w: [0, -1],
    a: [-1, 0],
    s: [0, 1],
    d: [1, 0],
    arrowup: [0, -1],
    arrowleft: [-1, 0],
    arrowdown: [0, 1],
    arrowright: [1, 0],
  };

  GameView.prototype.bindKeyHandlers = function() {
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (GameView.MOVES[key]) {
        e.preventDefault();
        this.pressedKeys.add(key);
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (GameView.MOVES[key]) {
        e.preventDefault();
        this.pressedKeys.delete(key);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    document.querySelectorAll('.control-btn').forEach(btn => {
        const direction = btn.dataset.direction;
        const startMove = (e) => {
            e.preventDefault();
            this.pressedKeys.add(direction);
        }
        const endMove = (e) => {
            e.preventDefault();
            this.pressedKeys.delete(direction);
        }
        btn.addEventListener('mousedown', startMove);
        btn.addEventListener('touchstart', startMove, { passive: false });
        btn.addEventListener('mouseup', endMove);
        btn.addEventListener('touchend', endMove);
        btn.addEventListener('mouseleave', endMove);
    });

    this.removeKeyHandlers = () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      // It's okay not to remove mobile listeners as they are specific to this page
    }
  };

  GameView.prototype.applyMovement = function() {
      let totalImpulse = [0, 0];
      this.pressedKeys.forEach(key => {
          const move = GameView.MOVES[key];
          if (move) {
              totalImpulse[0] += move[0];
              totalImpulse[1] += move[1];
          }
      });
      if (totalImpulse[0] !== 0 || totalImpulse[1] !== 0) {
        this.ship.power(totalImpulse);
      }
  }

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

    this.applyMovement();

    const timeDelta = time - this.lastTime;
    this.game.update(timeDelta / 1000);
    this.game.draw(this.ctx);
    this.lastTime = time;

    this.animationFrameId = requestAnimationFrame(this.animate.bind(this));
  };
})();
