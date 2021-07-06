const forestImage = new Image();
forestImage.src = '/images/forest.png';

class Game {
  constructor(canvas, screens) {
    this.canvas = canvas;
    this.screens = screens;
    this.context = canvas.getContext('2d');
    this.running = false;
    this.enableControls();
  }

  displayScreen (name) {
    const screenThatShouldBeDisplayed = this.screens[name];
    const screensThatShouldBeHidden = Object
      .values(this.screens)
      .filter(screen => screen !== screenThatShouldBeDisplayed);
    screenThatShouldBeDisplayed.style.display = '';
    for (const screen of screensThatShouldBeHidden) screen.style.display = 'none';
  }

  start () {
    this.running = true;
    this.lastEnemyCreationTimestamp = Date.now();
    this.enemyCreationInterval = 1000;
    this.score = 100;
    this.player = new Player(this, 100, this.canvas.height / 2);
    this.enemies = [];
    this.projectiles = [];
    this.loop();
    this.displayScreen('playing');
  }

  enableControls () {
    window.addEventListener('keydown', (event) => {
      const key = event.code;
      switch (key) {
        case 'ArrowUp':
          this.player.accelerationY = -0.1;
          break;
        case 'ArrowDown':
          this.player.accelerationY = +0.1;
          break;
        case 'ArrowRight':
          this.player.accelerationX = +0.1;
          break;
        case 'ArrowLeft':
          this.player.accelerationX = -0.1;
          break;
        case 'Space':
          this.fireProjectile();
          break;
      }
    });
    window.addEventListener('keyup', (event) => {
      const key = event.code;
      switch (key) {
        case 'ArrowUp':
        case 'ArrowDown':
          this.player.accelerationY = 0;
          break;
        case 'ArrowRight':
        case 'ArrowLeft':
          this.player.accelerationX = 0;
          break;
      }
    });
    this.canvas.addEventListener('click', () => {
      this.fireProjectile();
    });
  }

  fireProjectile () {
    const projectile = new Projectile(this, this.player.x, this.player.y);
    this.projectiles.push(projectile);
  }

  checkCollisions () {
    const player = this.player;
    this.enemies.forEach((enemy, index) => {
      if (enemy.checkIntersection(this.player)) {
        this.enemies.splice(index, 1);
        this.score -= 10;
      }
      this.projectiles.forEach((projectile, projectileIndex) => {
        if (enemy.checkIntersection(projectile)) {
          this.enemies.splice(index, 1);
          this.projectiles.splice(projectileIndex, 1);
          this.score += 5;
        }
      });
      if (enemy.x < 0) {
        this.score -= 10;
      }
    });
  }

  addEnemy () {
    const enemyX = this.canvas.width;
    const enemyY = Math.random() * this.canvas.height;
    const enemy = new Enemy(this, enemyX, enemyY);
    this.enemies.push(enemy);
  }

  loop () {
    this.runLogic();
    this.paint();
    if (this.running) {
      window.requestAnimationFrame(() => {
        this.loop();
      });
    }
  }

  runLogic () {
    const currentTimestamp = Date.now();
    // this.enemyCreationInterval--;
    if (currentTimestamp - this.lastEnemyCreationTimestamp > this.enemyCreationInterval) {
      this.addEnemy();
      this.lastEnemyCreationTimestamp = currentTimestamp;
    }
    this.player.runLogic();
    for (const enemy of this.enemies) {
      enemy.runLogic();
    }
    for (const projectile of this.projectiles) {
      projectile.runLogic();
    }
    this.checkCollisions();
    this.collectGarbage();
    if (this.score <= 0) {
      this.lose();
    }
  }

  lose () {
    this.running = false;
    this.displayScreen('gameOver');
  }

  collectGarbage () {
    this.enemies.forEach((enemy, index) => {
      if (enemy.x < 0) {
        this.enemies.splice(index, 1);
      }
    });
    this.projectiles.forEach((projectile, index) => {
      if (projectile.x > this.canvas.width) {
        this.projectiles.splice(index, 1);
      }
    });
  }

  clearScreen () {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  paintBackground () {
    const tileSize = 24;
    for (let row = 0; row < this.canvas.height / tileSize; row++) {
      for (let column = 0; column < this.canvas.width / tileSize; column++) {
        this.context.drawImage(
          forestImage,
          ((row + column) % 9) * tileSize,
          0,
          tileSize,
          tileSize,
          column * tileSize,
          row * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  }

  paintScore () {
    this.context.font = '32px sans-serif';
    this.context.fillText(`Score: ${this.score}`, 50, 450);
  }

  paint () {
    this.clearScreen();
    this.paintBackground();
    if (this.running) {
      this.player.paint();
      for (const enemy of this.enemies) {
        enemy.paint();
      }
      for (const projectile of this.projectiles) {
        projectile.paint();
      }
      this.paintScore();
    }
  }
}
