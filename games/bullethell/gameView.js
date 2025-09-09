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

    this.removeKeyHandlers = () => {
      document.removeEventListener('keydown', handleKeyDown);
    }
  };

  GameView.prototype.start = function() {
    this.bindKeyHandlers();
    this.lastTime = 0;
    //start the animation
    requestAnimationFrame(this.animate.bind(this));
  };

  GameView.prototype.animate = function(time) {
    if (this.game.gameOver) {
      this.removeKeyHandlers();
      // Optionally, display a game over message
      this.ctx.fillStyle = "white";
      this.ctx.font = "48px sans-serif";
      this.ctx.fillText("Game Over", 250, 300);
      return;
    }

    const timeDelta = time - this.lastTime;

    this.game.update(timeDelta / 1000); // Pass delta in seconds
    this.game.draw(this.ctx, this.ctx); // Pass both contexts for now

    this.lastTime = time;

    //every call to animate requests causes another call to animate
    requestAnimationFrame(this.animate.bind(this));
  };
})();
