(function () {
  window.BHGame = window.BHGame || {};

  var EnemySpinner = window.BHGame.EnemySpinner = function (pos, game) {
    var speed = 0.5 * BHGame.config.baseSpeed * BHGame.config.enemySpeedMultiplier;
    var vel = [0, speed];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      2, // Health
      EnemySpinner.RADIUS,
      'white',
      game,
      200 // Score
    );
    this.fireRate = 0.5; // Fires more often
    this.bulletAngle = 0;
  };

  EnemySpinner.RADIUS = 15;

  BHGame.Util.inherits(EnemySpinner, BHGame.EnemyObject);

  EnemySpinner.prototype.draw = function(ctx) {
    const size = EnemySpinner.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("👾", this.pos[0], this.pos[1]);
  };

  // Override fireBullet for a circular pattern
  EnemySpinner.prototype.fireBullet = function () {
    const speed = 3 * BHGame.config.enemySpeedMultiplier;
    const rad = this.bulletAngle * (Math.PI / 180);
    const vel = [Math.sin(rad) * speed, -Math.cos(rad) * speed];
    const bullet = new BHGame.EnemyBullet(this.pos.slice(), vel, this.game);
    this.game.add(bullet);

    this.bulletAngle += 45; // Rotate for next shot
    if (this.bulletAngle >= 360) {
        this.bulletAngle = 0;
    }
  };

})();
