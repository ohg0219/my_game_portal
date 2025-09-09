(function () {
  window.BHGame = window.BHGame || {};

  var Bullet = window.BHGame.Bullet = function (pos, vel, game) {
    BHGame.MovingObject.call(this, pos, vel, Bullet.RADIUS, Bullet.COLOR, game);
  };

  Bullet.RADIUS = 3;
  Bullet.COLOR = "yellow";

  BHGame.Util.inherits(Bullet, BHGame.MovingObject);

})();
