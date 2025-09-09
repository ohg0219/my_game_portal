(function () {
  window.BHGame = window.BHGame || {};

  var EnemyBullet = window.BHGame.EnemyBullet = function (pos, vel, game) {
    BHGame.MovingObject.call(this, pos, vel, EnemyBullet.RADIUS, EnemyBullet.COLOR, game);
  };

  EnemyBullet.RADIUS = 4;
  EnemyBullet.COLOR = "red";

  BHGame.Util.inherits(EnemyBullet, BHGame.MovingObject);

})();
