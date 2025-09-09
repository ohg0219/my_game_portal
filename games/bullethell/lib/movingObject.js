(function () {
  window.BHGame = window.BHGame || {};

  var MovingObject = window.BHGame.MovingObject = function (
    pos,
    vel,
    radius,
    color,
    game
  ) {
    this.pos = pos;
    this.vel = vel;
    this.radius = radius;
    this.color = color;
    this.game = game;
    this.isBounded = false;
  };

  MovingObject.prototype.draw = function (ctx) {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.pos[0], this.pos[1], this.radius, 0, 2 * Math.PI, false);
    ctx.fill();
  };

  MovingObject.prototype.move = function (delta) {
    this.pos[0] += this.vel[0] * delta * 100;
    this.pos[1] += this.vel[1] * delta * 100;

    if (this.game.isOutOfBounds(this.pos)) {
      if (this.isBounded) {
        this.pos = this.game.bound(this.pos);
      } else {
        this.game.remove(this);
      }
    }
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    const centerDist = Math.sqrt(
      Math.pow(this.pos[0] - otherObject.pos[0], 2) +
      Math.pow(this.pos[1] - otherObject.pos[1], 2)
    );
    return centerDist < this.radius + otherObject.radius;
  };

  MovingObject.prototype.collideWith = function (otherObject) {
    // default is no-op
  };
})();
