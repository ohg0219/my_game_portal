(function () {
  window.BHGame = window.BHGame || {};

  var EnemySatellite = window.BHGame.EnemySatellite = function (pos, game) {
    var speed = 0.5 * BHGame.config.baseSpeed * BHGame.config.enemySpeedMultiplier;
    var vel = [0, speed];
    BHGame.EnemyObject.call(
      this,
      pos,
      vel,
      2, // Health (2 hits)
      EnemySatellite.RADIUS,
      'white',
      game,
      150 // Score
    );
  };

  EnemySatellite.RADIUS = 15;

  BHGame.Util.inherits(EnemySatellite, BHGame.EnemyObject);

  EnemySatellite.prototype.draw = function(ctx) {
    const size = EnemySatellite.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🛰️", this.pos[0], this.pos[1]);
  };

})();
