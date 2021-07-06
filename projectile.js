class Projectile {
  constructor (game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 4;
  }

  runLogic () {
    this.x += 2;
  }

  paint () {
    const context = this.game.context;
    context.save();
    context.fillStyle = 'yellow';
    context.fillRect(
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
  }
} 