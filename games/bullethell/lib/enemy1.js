(function () {
  window.BHGame = window.BHGame || {};

  var Enemy1 = window.BHGame.Enemy1 = function (pos, game) {
    var vel = [0, 1];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      Enemy1.HEALTH,
      Enemy1.RADIUS,
      'white',
      game
    );
  };

  Enemy1.RADIUS = 15;
  Enemy1.HEALTH = 30;

  BHGame.Util.inherits(Enemy1, BHGame.EnemyObject);

  Enemy1.prototype.draw = function(ctx) {
    ctx.font = "30px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🛸", this.pos[0], this.pos[1]);
  };

})();
