(function() {
  window.BHGame = window.BHGame || {};

  var Ship = (window.BHGame.Ship = function(pos, game) {
    BHGame.MovingObject.call(this, pos, [0, 0], Ship.RADIUS, Ship.COLOR, game);
    this.isBounded = true;
  });

  Ship.RADIUS = 15;
  Ship.COLOR = 'white';

  BHGame.Util.inherits(Ship, BHGame.MovingObject);

  Ship.prototype.draw = function(ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.pos[0], this.pos[1] - Ship.RADIUS);
    ctx.lineTo(this.pos[0] - Ship.RADIUS, this.pos[1] + Ship.RADIUS);
    ctx.lineTo(this.pos[0] + Ship.RADIUS, this.pos[1] + Ship.RADIUS);
    ctx.closePath();
    ctx.fill();
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
    this.vel[0] += impulse[0];
    this.vel[1] += impulse[1];
  };

  Ship.prototype.fireBullet = function() {
    const bullet = new BHGame.Bullet(this.pos.slice(), [0, -5], this.game);
    this.game.add(bullet);
  };

  Ship.prototype.move = function(delta) {
    this.pos[0] += this.vel[0] * delta * 5;
    this.pos[1] += this.vel[1] * delta * 5;
    this.vel = [0,0]; // Reset velocity after each move

    if (this.game.isOutOfBounds(this.pos)) {
      this.pos = this.game.bound(this.pos);
    }
  };

})();
