(function() {
  window.BHGame = window.BHGame || {};

  var Ship = (window.BHGame.Ship = function(pos, game) {
    BHGame.MovingObject.call(this, pos, [0, 0], Ship.RADIUS, 'white', game);
    this.isBounded = true;

    // Movement properties
    this.vel = [0, 0];
    this.maxSpeed = 5;
    this.friction = 0.9;

    // Autofire properties
    this.fireCooldown = 0.2;
    this.fireTimer = 0;

    // Power-up properties
    this.missileLevel = 1;
    this.isShielded = false;
    this.shieldTimer = 0;

    // Life/Death properties
    this.isDying = false;
    this.deathTimer = 0;
    this.isInvincible = false;
    this.invincibleTimer = 0;
  });

  Ship.RADIUS = 15;

  BHGame.Util.inherits(Ship, BHGame.MovingObject);

  Ship.prototype.draw = function(ctx) {
    if (this.isDying) {
        const size = 60 * BHGame.config.scale;
        ctx.font = `${size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("💥", this.pos[0], this.pos[1]);
        return;
    }

    // Blinking effect for invincibility
    if (this.isInvincible) {
        if (Math.floor(this.invincibleTimer * 10) % 2 === 0) {
            return; // Skip drawing every other frame to blink
        }
    }

    // Draw shield
    if (this.isShielded) {
        ctx.strokeStyle = "rgba(0, 150, 255, 0.8)";
        ctx.lineWidth = 3;
        ctx.beginPath();
        const shieldRadius = (Ship.RADIUS + 5) * BHGame.config.scale;
        ctx.arc(this.pos[0], this.pos[1], shieldRadius, 0, 2 * Math.PI, false);
        ctx.stroke();
    }

    // Draw ship
    const size = 30 * BHGame.config.scale;
    ctx.save();
    ctx.translate(this.pos[0], this.pos[1]);
    ctx.rotate(-Math.PI / 4);
    ctx.font = `${size}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("🚀", 0, 0);
    ctx.restore();
  };

  Ship.prototype.collideWith = function(otherObject) {
    // Items can be collected even when invincible/shielded
    if (otherObject instanceof BHGame.Item) {
        this.activatePowerUp(otherObject.type);
        this.game.remove(otherObject);
        return;
    }

    if (this.isDying || this.isInvincible || this.isShielded) {
        return;
    }

    if (otherObject instanceof BHGame.EnemyObject || otherObject instanceof BHGame.EnemyBullet) {
      this.game.remove(otherObject);
      this.die();
    }
  };

  Ship.prototype.die = function() {
      this.game.lives--;
      if (this.game.lives <= 0) {
          this.game.gameOver = true;
      }
      this.isDying = true;
      this.deathTimer = 0.5; // death animation duration
      this.vel = [0, 0];
  }

  Ship.prototype.activatePowerUp = function(type) {
      this.game.displayPowerUpMessage(type);
      switch(type) {
          case 'missile':
              this.missileLevel++;
              break;
          case 'life':
              this.game.lives = Math.min(this.game.lives + 1, 100);
              break;
          case 'shield':
              this.isShielded = true;
              this.shieldTimer = 5;
              break;
          case 'fireRate':
              this.fireCooldown = Math.max(this.fireCooldown * 0.8, 0.05); // 20% faster, cap at 0.05s
              break;
      }
  }

  Ship.prototype.relocate = function() {
    this.pos = [BHGame.Game.DIM_X / 2, BHGame.Game.DIM_Y - 50];
    this.vel = [0, 0];
    this.isInvincible = true;
    this.invincibleTimer = 1.5; // Respawn invincibility
  };

  Ship.prototype.power = function(impulse) {
    if (this.isDying) return;
    this.vel[0] += impulse[0] * 0.3;
    this.vel[1] += impulse[1] * 0.3;
  };

  Ship.prototype.fireBullet = function() {
    const spreadAngle = 15;
    const totalAngle = (this.missileLevel - 1) * spreadAngle;
    const startAngle = -totalAngle / 2;

    for (let i = 0; i < this.missileLevel; i++) {
        const angle = startAngle + i * spreadAngle;
        const rad = angle * (Math.PI / 180);
        const vel = [Math.sin(rad) * 8, -Math.cos(rad) * 8];
        const bullet = new BHGame.Bullet(this.pos.slice(), vel, this.game);
        this.game.add(bullet);
    }
  };

  Ship.prototype.move = function(delta) {
    // Handle death animation
    if (this.isDying) {
        this.deathTimer -= delta;
        if (this.deathTimer <= 0) {
            this.isDying = false;
            if (!this.game.gameOver) {
                this.relocate();
            }
        }
        return; // Don't move/shoot while dying
    }

    // Handle invincibility timer
    if (this.isInvincible) {
        this.invincibleTimer -= delta;
        if (this.invincibleTimer <= 0) {
            this.isInvincible = false;
        }
    }

    // Shield timer
    if (this.isShielded) {
        this.shieldTimer -= delta;
        if (this.shieldTimer <= 0) {
            this.isShielded = false;
        }
    }

    // Apply friction
    this.vel[0] *= this.friction;
    this.vel[1] *= this.friction;

    // Cap speed
    const speed = Math.sqrt(this.vel[0] * this.vel[0] + this.vel[1] * this.vel[1]);
    if (speed > this.maxSpeed) {
        this.vel[0] = (this.vel[0] / speed) * this.maxSpeed;
        this.vel[1] = (this.vel[1] / speed) * this.maxSpeed;
    }

    // Update position
    this.pos[0] += this.vel[0];
    this.pos[1] += this.vel[1];

    // Handle bounds
    this.pos = this.game.bound(this.pos);

    // Handle autofire
    this.fireTimer += delta;
    if (this.fireTimer > this.fireCooldown) {
        this.fireBullet();
        this.fireTimer = 0;
    }
  };

})();
