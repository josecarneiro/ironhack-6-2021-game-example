const runningEnemyImage = new Image();
runningEnemyImage.src = '/images/goblin/run.png';

class Enemy {
  constructor (game, x, y) {
    this.game = game;
    this.x = x;
    this.y = y;
    this.width = 29;
    this.height = 31;
    this.frame = 0;
  }

  checkIntersection (element) {
    return (
      // If right edge of element is over left edge of enemy
      element.x + element.width / 2 >= this.x - this.width / 2 &&
      // If left edge of element is below right edge of enemy
      element.x - element.width / 2 <= this.x + this.width / 2 &&
      // If bottom edge of element is over top edge of enemy
      element.y + element.height / 2 >= this.y - this.height / 2 &&
      // If top edge of element is below bottom edge of enemy
      element.y - element.height / 2 <= this.y + this.height / 2
    );
  }

  runLogic () {
    this.x--;
  }

  paint () {
    const context = this.game.context;
    context.save();
    context.drawImage(
      runningEnemyImage,
      62 + 150 * Math.round(this.frame / 10),
      64,
      26,
      36,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
    context.restore();
    this.frame++;
    this.frame %= 70;
    
  }
}