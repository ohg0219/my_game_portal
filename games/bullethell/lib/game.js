(function () {
  window.BHGame = window.BHGame || {};

  var Game = window.BHGame.Game = function () {
    this.enemies = [];
    this.bullets = [];
    this.eBullets = [];
    this.gameTime = 0;
    this.score = 0;
    this.deaths = 0;
    this.gameOver = false;

    this.ship = new BHGame.Ship([Game.DIM_X / 2, Game.DIM_Y - 50], this);

    this.enemySpawnTimer = 0;
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ENEMIES = 10;

  Game.prototype.add = function (object) {
    if (object instanceof BHGame.EnemyObject) {
      this.enemies.push(object);
    } else if (object instanceof BHGame.Bullet) {
      this.bullets.push(object);
    } else if (object instanceof BHGame.EnemyBullet) {
      this.eBullets.push(object);
    }
  };

  Game.prototype.allObjects = function () {
    return [].concat(this.ship, this.enemies, this.bullets, this.eBullets);
  };

  Game.prototype.checkCollisions = function () {
    const allObjects = this.allObjects();
    for (let i = 0; i < allObjects.length; i++) {
      for (let j = i + 1; j < allObjects.length; j++) {
        const obj1 = allObjects[i];
        const obj2 = allObjects[j];

        if (obj1.isCollidedWith(obj2)) {
          obj1.collideWith(obj2);
        }
      }
    }
  };

  Game.prototype.draw = function (ctx) {
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, Game.DIM_X, Game.DIM_Y);

    this.allObjects().forEach(function (object) {
      object.draw(ctx);
    });

    this.renderHUD(ctx);
  };

  Game.prototype.renderHUD = function (ctx){
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "left";
    ctx.fillText("LIVES: " + (3 - this.deaths), 10, 20);
    ctx.textAlign = "right";
    ctx.fillText("SCORE: " + this.score, Game.DIM_X - 10, 20);
  };


  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[0] < 0) || (pos[1] < 0) ||
      (pos[0] > Game.DIM_X) || (pos[1] > Game.DIM_Y);
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach(function (object) {
      object.move(delta);
    });
  };

  Game.prototype.remove = function (object) {
    if (object instanceof BHGame.Bullet) {
      this.bullets.splice(this.bullets.indexOf(object), 1);
    } else if (object instanceof BHGame.EnemyObject) {
      this.enemies.splice(this.enemies.indexOf(object), 1);
    } else if (object instanceof BHGame.EnemyBullet) {
      this.eBullets.splice(this.eBullets.indexOf(object), 1);
    }
  };

  Game.prototype.step = function (delta) {
    this.moveObjects(delta);
    this.checkCollisions();
  };

  Game.prototype.update = function(delta) {
    this.gameTime += delta;
    this.enemySpawnTimer += delta;

    if (this.enemySpawnTimer > 1) { // Spawn a new enemy every 1 second
        this.spawnEnemy();
        this.enemySpawnTimer = 0;
    }

    this.step(delta);
  }

  Game.prototype.spawnEnemy = function() {
    if (this.enemies.length < Game.NUM_ENEMIES) {
        const randomX = Math.random() * (Game.DIM_X - 50) + 25;
        const enemy = new BHGame.Enemy1([randomX, 0], this);
        this.add(enemy);
    }
  }

  Game.prototype.bound = function (pos) {
    var x = pos[0];
    var y = pos[1];
    var offset = 10;
    if (!(x < Game.DIM_X-offset && x > offset)){
      x = (x <= offset ? offset : Game.DIM_X-offset);
    };
    if (!(y < Game.DIM_Y-offset && y > offset)){
      y = (y <= offset ? offset : Game.DIM_Y-offset);
    };
    return [x, y];
  };

})();
