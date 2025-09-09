(function () {
  window.BHGame = window.BHGame || {};

  var EnemyObject = window.BHGame.EnemyObject = function (
    pos,
    vel,
    health,
    radius,
    color,
    game
  ) {
    BHGame.MovingObject.call(this, pos, vel, radius, color, game);
    this.health = health;
    this.fireRate = 1; // seconds
    this.fireTimer = 0;
  };

  BHGame.Util.inherits(EnemyObject, BHGame.MovingObject);

  EnemyObject.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof BHGame.Ship) {
      // Handled in Ship.prototype.collideWith
      return;
    }

    if (otherObject instanceof BHGame.Bullet) {
      this.game.remove(otherObject);
      this.health -= 10;
      if (this.health <= 0) {
        this.game.score += 100;
        this.game.remove(this);
      }
    }
  };

  EnemyObject.prototype.fireBullet = function () {
    const angle = Math.atan2(
        this.game.ship.pos[1] - this.pos[1],
        this.game.ship.pos[0] - this.pos[0]
    );
    const vel = [Math.cos(angle) * 2, Math.sin(angle) * 2];
    const bullet = new BHGame.EnemyBullet(this.pos.slice(), vel, this.game);
    this.game.add(bullet);
  };

  EnemyObject.prototype.move = function(delta) {
    BHGame.MovingObject.prototype.move.call(this, delta);

    this.fireTimer += delta;
    if (this.fireTimer > this.fireRate) {
        this.fireBullet();
        this.fireTimer = 0;
    }
  }

})();
