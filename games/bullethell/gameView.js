(function () {
  window.BHGame = window.BHGame || {};

  const GameView = (window.BHGame.GameView = function(game, ctx) {
    this.ctx = ctx;
    this.game = game;
    this.ship = this.game.ship;
  });

  GameView.MOVES = {
    w: [0, -1],
    a: [-1, 0],
    s: [0, 1],
    d: [1, 0],
  };

  GameView.prototype.bindKeyHandlers = function() {
    const ship = this.ship;
    let moveInterval;

    // Keyboard controls
    const handleKeyDown = (e) => {
      const move = GameView.MOVES[e.key];
      if (move) {
        ship.power(move);
      }
      if (e.key === ' ') {
        ship.fireBullet();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // Mobile controls
    document.querySelectorAll('.control-btn').forEach(btn => {
        const direction = btn.dataset.direction;
        if (direction) {
            const move = GameView.MOVES[direction];
            const startMove = (e) => {
                e.preventDefault();
                if (!moveInterval) {
                   moveInterval = setInterval(() => ship.power(move), 50);
                }
            }
            const endMove = (e) => {
                e.preventDefault();
                clearInterval(moveInterval);
                moveInterval = null;
            }
            btn.addEventListener('mousedown', startMove);
            btn.addEventListener('touchstart', startMove);
            btn.addEventListener('mouseup', endMove);
            btn.addEventListener('touchend', endMove);
            btn.addEventListener('mouseleave', endMove);
        }
    });

    document.getElementById('fire-btn').addEventListener('click', (e) => {
        e.preventDefault();
        ship.fireBullet();
    });


    this.removeKeyHandlers = () => {
      document.removeEventListener('keydown', handleKeyDown);
      // a more robust solution would be to remove the mobile listeners too
    }
  };

  GameView.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function(time) {
    if (this.game.gameOver) {
      this.removeKeyHandlers();
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      this.ctx.fillRect(0, 0, BHGame.Game.DIM_X, BHGame.Game.DIM_Y);
      this.ctx.fillStyle = "white";
      this.ctx.font = "48px sans-serif";
      this.ctx.textAlign = "center";
      this.ctx.fillText("Game Over", BHGame.Game.DIM_X / 2, BHGame.Game.DIM_Y / 2);
      return;
    }

    const timeDelta = time - this.lastTime;
    this.game.update(timeDelta / 1000);
    this.game.draw(this.ctx);
    this.lastTime = time;

    requestAnimationFrame(this.animate.bind(this));
  };
})();
