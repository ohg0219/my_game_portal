(function () {
  window.BHGame = window.BHGame || {};

  var EnemyObject = window.BHGame.EnemyObject = function (
    pos,
    vel,
    health,
    radius,
    color,
    game,
    score
  ) {
    BHGame.MovingObject.call(this, pos, vel, radius, color, game);
    this.health = health; // Now represents hits
    this.score = score;
    this.fireRate = 1.5; // seconds
    this.fireTimer = Math.random() * this.fireRate; // Stagger initial shots
  };

  BHGame.Util.inherits(EnemyObject, BHGame.MovingObject);

  EnemyObject.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof BHGame.Ship) {
      // Handled in Ship.prototype.collideWith
      return;
    }

    if (otherObject instanceof BHGame.Bullet) {
      this.game.remove(otherObject);
      this.health -= 1; // Decrement health by 1 hit
      if (this.health <= 0) {
        this.game.score += this.score;
        this.game.remove(this);
      }
    }
  };

  EnemyObject.prototype.fireBullet = function () {
    const angle = Math.atan2(
        this.game.ship.pos[1] - this.pos[1],
        this.game.ship.pos[0] - this.pos[0]
    );
    const speed = 2 * BHGame.config.enemySpeedMultiplier;
    const vel = [Math.cos(angle) * speed, Math.sin(angle) * speed];
    const bullet = new BHGame.EnemyBullet(this.pos.slice(), vel, this.game);
    this.game.add(bullet);
  };

  EnemyObject.prototype.move = function(delta) {
    BHGame.MovingObject.prototype.move.call(this, delta);

    // Don't fire if off-screen
    if (this.pos[1] < 0) return;

    this.fireTimer += delta;
    if (this.fireTimer > this.fireRate) {
        this.fireBullet();
        this.fireTimer = 0;
    }
  }

})();
