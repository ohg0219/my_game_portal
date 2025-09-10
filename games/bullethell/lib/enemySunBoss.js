(function () {
  window.BHGame = window.BHGame || {};

  var EnemySunBoss = window.BHGame.EnemySunBoss = function (pos, game, health) {
    var speed = 4 * BHGame.config.enemySpeedMultiplier; // 2x regular boss speed
    var vel = [speed, 0];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      health || 20, // 2x regular boss health
      EnemySunBoss.RADIUS,
      'white',
      game,
      2000 // 2x regular boss score
    );
    this.isBounded = true;
    this.targetPosition = null;
    this.setNewTarget();
  };

  EnemySunBoss.RADIUS = 60; // 2x regular boss size

  BHGame.Util.inherits(EnemySunBoss, BHGame.EnemyBoss); // Inherits from EnemyBoss

  EnemySunBoss.prototype.draw = function(ctx) {
    const size = EnemySunBoss.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("☀️", this.pos[0], this.pos[1]);
  };

  // Override fireBullet for a more intense attack
  EnemySunBoss.prototype.fireBullet = function () {
    const spreadAngle = 15;
    // Fires 6 bullets instead of 3
    for (let i = -2.5; i <= 2.5; i++) {
        const angle = 180 + (i * spreadAngle);
        const rad = angle * (Math.PI / 180);
        const speed = 4 * BHGame.config.enemySpeedMultiplier;
        const vel = [Math.sin(rad) * speed, -Math.cos(rad) * speed];
        const bullet = new BHGame.EnemyBullet(this.pos.slice(), vel, this.game);
        this.game.add(bullet);
    }
  };

})();
