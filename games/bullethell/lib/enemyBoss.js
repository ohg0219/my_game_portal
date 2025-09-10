(function () {
  window.BHGame = window.BHGame || {};

  var EnemyBoss = window.BHGame.EnemyBoss = function (pos, game, health) {
    var speed = 2 * BHGame.config.enemySpeedMultiplier;
    var vel = [speed, 0];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      health || 10,
      EnemyBoss.RADIUS,
      'white',
      game,
      1000
    );
    this.isBounded = true;
    this.targetPosition = null;
    this.setNewTarget();
  };

  EnemyBoss.RADIUS = 30;

  BHGame.Util.inherits(EnemyBoss, BHGame.EnemyObject);

  EnemyBoss.prototype.draw = function(ctx) {
    const size = EnemyBoss.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🌕", this.pos[0], this.pos[1]);
  };

  EnemyBoss.prototype.setNewTarget = function() {
      const x = Math.random() * (BHGame.Game.DIM_X - EnemyBoss.RADIUS * 2) + EnemyBoss.RADIUS;
      const y = Math.random() * (BHGame.Game.DIM_Y / 3) + EnemyBoss.RADIUS;
      this.targetPosition = [x, y];
  }

  EnemyBoss.prototype.fireBullet = function () {
    const spreadAngle = 15; // degrees
    for (let i = -1; i <= 1; i++) {
        const angle = 180 + (i * spreadAngle); // 180 is downward
        const rad = angle * (Math.PI / 180);
        const speed = 3 * BHGame.config.enemySpeedMultiplier;
        const vel = [Math.sin(rad) * speed, -Math.cos(rad) * speed];
        const bullet = new BHGame.EnemyBullet(this.pos.slice(), vel, this.game);
        this.game.add(bullet);
    }
  };

  EnemyBoss.prototype.move = function(delta) {
    const dist = Math.sqrt(
        Math.pow(this.pos[0] - this.targetPosition[0], 2) +
        Math.pow(this.pos[1] - this.targetPosition[1], 2)
    );

    if (dist < 10) {
        this.setNewTarget();
    }

    const angle = Math.atan2(
        this.targetPosition[1] - this.pos[1],
        this.targetPosition[0] - this.pos[0]
    );
    const speed = 2 * BHGame.config.enemySpeedMultiplier;
    this.vel = [Math.cos(angle) * speed, Math.sin(angle) * speed];

    BHGame.MovingObject.prototype.move.call(this, delta);

    // Fire bullets
    this.fireTimer += delta;
    if (this.fireTimer > this.fireRate) {
        this.fireBullet();
        this.fireTimer = 0;
    }
  }

})();
