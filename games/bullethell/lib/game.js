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
    this.bossMode = false;
    this.bossSpawned = false;

    this.ship = new BHGame.Ship([Game.DIM_X / 2, Game.DIM_Y - 50], this);

    this.enemySpawnTimer = 0;
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ENEMIES = 10;
  Game.BOSS_SCORE_THRESHOLD = 2000;

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

        if (!obj1 || !obj2) continue; // Skip if an object was removed

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

    if (this.bossMode) {
        const boss = this.enemies.find(e => e instanceof BHGame.EnemyBoss);
        if (boss) {
            ctx.textAlign = "center";
            ctx.fillText(`BOSS HP: ${boss.health}`, Game.DIM_X / 2, 20);
        }
    }
  };

  Game.prototype.isOutOfBounds = function (pos) {
    return (pos[1] > Game.DIM_Y) || (pos[1] < -50); // Give some buffer for spawning
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
    if (this.score >= Game.BOSS_SCORE_THRESHOLD && !this.bossMode) {
        this.bossMode = true;
    }

    if (this.bossMode) {
        if (!this.bossSpawned) {
            this.spawnBoss();
            this.bossSpawned = true;
        }
    } else {
        this.enemySpawnTimer += delta;
        if (this.enemySpawnTimer > 1) {
            this.spawnEnemy();
            this.enemySpawnTimer = 0;
        }
    }

    this.step(delta);
  }

  Game.prototype.spawnEnemy = function() {
    if (this.enemies.length < Game.NUM_ENEMIES) {
        const randomX = Math.random() * (Game.DIM_X - 50) + 25;
        const pos = [randomX, -30];
        let enemy;
        if (Math.random() < 0.7) {
            enemy = new BHGame.EnemyUFO(pos, this);
        } else {
            enemy = new BHGame.EnemySatellite(pos, this);
        }
        this.add(enemy);
    }
  }

  Game.prototype.spawnBoss = function() {
      // Clear existing enemies
      this.enemies = [];
      const pos = [Game.DIM_X / 2, 100];
      const boss = new BHGame.EnemyBoss(pos, this);
      this.add(boss);
  }

  Game.prototype.bound = function (pos) {
    var x = pos[0];
    var y = pos[1];
    var offset = 10;
    if (x < offset) x = offset;
    if (x > Game.DIM_X - offset) x = Game.DIM_X - offset;
    if (y < offset) y = offset;
    if (y > Game.DIM_Y - offset) y = Game.DIM_Y - offset;
    return [x, y];
  };

})();
