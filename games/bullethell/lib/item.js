(function () {
  window.BHGame = window.BHGame || {};

  // Weighted list for item drops
  const ITEM_TYPES = [
      'missile', 'missile', 'missile',
      'fireRate', 'fireRate', 'fireRate',
      'shield', 'shield',
      'life'
    ];

  var Item = window.BHGame.Item = function (pos, game) {
    this.type = ITEM_TYPES[Math.floor(Math.random() * ITEM_TYPES.length)];
    var vel = [0, 1]; // Constant speed

    BHGame.MovingObject.call(
      this,
      pos,
      vel,
      Item.RADIUS,
      'white', // color is not used for emoji
      game
    );
  };

  Item.RADIUS = 15;

  BHGame.Util.inherits(Item, BHGame.MovingObject);

  Item.prototype.draw = function(ctx) {
    const size = Item.RADIUS * 2 * BHGame.config.scale;
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🎁", this.pos[0], this.pos[1]);
  };

})();
