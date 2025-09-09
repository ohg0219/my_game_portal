(function() {
  window.BHGame = window.BHGame || {};

  var Ship = (window.BHGame.Ship = function(pos, game) {
    BHGame.MovingObject.call(this, pos, [0, 0], Ship.RADIUS, 'white', game);
    this.isBounded = true;

    // Movement properties
    this.vel = [0, 0];
    this.maxSpeed = 7;
    this.friction = 0.95;

    // Autofire properties
    this.fireCooldown = 0.2; // seconds
    this.fireTimer = 0;
  });

  Ship.RADIUS = 15;

  BHGame.Util.inherits(Ship, BHGame.MovingObject);

  Ship.prototype.draw = function(ctx) {
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(-Math.PI / 4); // Rotate -45 degrees
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚀", 0, 0);
    ctx.restore();
  };

  Ship.prototype.collideWith = function(otherObject) {
    if (otherObject instanceof BHGame.EnemyObject || otherObject instanceof BHGame.EnemyBullet) {
      this.game.deaths += 1;
      if (this.game.deaths >= 3) {
        this.game.gameOver = true;
      }
      this.game.remove(otherObject);
      this.relocate();
    }
  };

  Ship.prototype.relocate = function() {
    this.pos = [BHGame.Game.DIM_X / 2, BHGame.Game.DIM_Y - 50];
    this.vel = [0, 0];
  };

  Ship.prototype.power = function(impulse) {
    this.vel[0] += impulse[0] * 0.5;
    this.vel[1] += impulse[1] * 0.5;
  };

  Ship.prototype.fireBullet = function() {
    const bullet = new BHGame.Bullet(this.pos.slice(), [0, -8], this.game);
    this.game.add(bullet);
  };

  Ship.prototype.move = function(delta) {
    // Apply friction
    this.vel[0] *= this.friction;
    this.vel[1] *= this.friction;

    // Cap speed
    const speed = Math.sqrt(this.vel[0] * this.vel[0] + this.vel[1] * this.vel[1]);
    if (speed > this.maxSpeed) {
        this.vel[0] = (this.vel[0] / speed) * this.maxSpeed;
        this.vel[1] = (this.vel[1] / speed) * this.maxSpeed;
    }

    // Update position
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    // Handle bounds
    if (this.game.isOutOfBounds(this.pos)) {
      this.pos = this.game.bound(this.pos);
    }

    // Handle autofire
    this.fireTimer += delta;
    if (this.fireTimer > this.fireCooldown) {
        this.fireBullet();
        this.fireTimer = 0;
    }
  };

})();
