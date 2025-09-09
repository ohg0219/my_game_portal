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
      Enemy1.COLOR,
      game
    );
  };

  Enemy1.RADIUS = 15;
  Enemy1.COLOR = "cyan";
  Enemy1.HEALTH = 30;

  BHGame.Util.inherits(Enemy1, BHGame.EnemyObject);

})();
