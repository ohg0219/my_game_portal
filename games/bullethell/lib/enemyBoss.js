(function () {
  window.BHGame = window.BHGame || {};

  var EnemyBoss = window.BHGame.EnemyBoss = function (pos, game) {
    var vel = [1 * BHGame.config.baseSpeed, 0]; // Start moving right
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      10, // Health (10 hits)
      EnemyBoss.RADIUS,
      'white',
      game,
      1000 // Score
    );
    this.isBounded = true; // Stay on screen
  };

  EnemyBoss.RADIUS = 30; // 2x UFO size

  BHGame.Util.inherits(EnemyBoss, BHGame.EnemyObject);

  EnemyBoss.prototype.draw = function(ctx) {
    const size = EnemyBoss.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌕", this.pos[0], this.pos[1]);
  };

  EnemyBoss.prototype.move = function(delta) {
    // Standard move updates position based on velocity
    BHGame.MovingObject.prototype.move.call(this, delta);

    // Bounce off the sides
    if (this.pos[0] - this.radius < 0 || this.pos[0] + this.radius > BHGame.Game.DIM_X) {
        this.vel[0] = -this.vel[0];
    }

    // Fire bullets
    this.fireTimer += delta;
    if (this.fireTimer > this.fireRate) {
        this.fireBullet(); // Uses the parent fireBullet method
        this.fireTimer = 0;
    }
  }

})();
