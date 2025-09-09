(function () {
  window.BHGame = window.BHGame || {};

  var EnemyUFO = window.BHGame.EnemyUFO = function (pos, game) {
    var vel = [0, 1 * BHGame.config.baseSpeed];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      1, // Health (1 hit)
      EnemyUFO.RADIUS,
      'white',
      game,
      100 // Score
    );
  };

  EnemyUFO.RADIUS = 15;

  BHGame.Util.inherits(EnemyUFO, BHGame.EnemyObject);

  EnemyUFO.prototype.draw = function(ctx) {
    const size = EnemyUFO.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🛸", this.pos[0], this.pos[1]);
  };

})();
