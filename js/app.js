'use strict';

const PLAYER_STEP_X = 101;
const PLAYER_STEP_Y = 83;
const MAX_LIVES = 6;
const NUM_ENEMIES = 5;
const ENEMY_Y_POSITIONS = [60, 145, 230];
const lives = document.getElementById('lives');
const restart = document.getElementById('restart');

const playerSprites = [
  'images/char-boy.png',
  'images/char-cat-girl.png',
  'images/char-horn-girl.png',
  'images/char-pink-girl.png',
  'images/char-princess-girl.png'
];
let gameOver = false;
let numLives = MAX_LIVES;

class Enemy extends Object {
  constructor(x, y) {
    super();
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomSpeed();
  }

  randomSpeed() {
    return Math.floor(Math.random() * Math.floor(150)) + 100;
  }
  update(dt) {
    let maxLeftX, maxRightX, maxTopY, maxBottomY;
    let new_x = this.x + this.speed * dt;
    // new X position is beyond the canvas, reset x to -10 and randomize the speed
    if (new_x > 500) {
      this.x = -10;
      this.speed = this.randomSpeed();
    }
    this.x += this.speed * dt;

    // X and Y border of enemy
    maxLeftX = this.x - 70;
    maxRightX = this.x + 70;
    maxTopY = this.y - 60;
    maxBottomY = this.y + 60;

    // check for collision with player
    if (
      player.x > maxLeftX &&
      player.x < maxRightX &&
      player.y > maxTopY &&
      player.y < maxBottomY
    ) {
      // if collision occurs, deduct number of lives and reset player position
      numLives -= 1;
      updateStatus('Collision!', 'amber-text text-accent-3');
      player.resetPosition();
      if (numLives === 0) {
        updateStatus('Game Over!', 'red-text text-lighten-2');
        gameOver = true;
      }
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

class Player extends Object {
  static INITIAL_PLAYER_X = 200;
  static INITIAL_PLAYER_Y = 400;
  static DEFAULT_CHARACTER = 0;
  constructor() {
    super();
    let lsCharacter = localStorage.getItem('playerCharacter');
    if (lsCharacter == null) {
      this.character = Player.DEFAULT_CHARACTER;
    } else {
      this.character = parseInt(lsCharacter);
    }
    this.sprite = playerSprites[this.character];

    this.x = Player.INITIAL_PLAYER_X;
    this.y = Player.INITIAL_PLAYER_Y;
  }

  resetPosition() {
    this.x = Player.INITIAL_PLAYER_X;
    this.y = Player.INITIAL_PLAYER_Y;
  }
  update() {}

  changeCharacter() {
    if (this.character === 4) {
      this.character = 0;
    } else {
      this.character += 1;
    }
    localStorage.setItem('playerCharacter', this.character);
    this.sprite = playerSprites[this.character];
    updateStatus("Player's Character Changed");
    this.resetPosition();
  }

  handleInput(keyCode) {
    if (!gameOver) {
      switch (keyCode) {
        case 'change':
          this.changeCharacter();
          break;
        case 'up':
          this.moveUp();
          break;
        case 'down':
          this.moveDown();
          break;
        case 'left':
          this.moveLeft();
          break;
        case 'right':
          this.moveRight();
          break;
      }
    }
  }

  moveLeft() {
    let new_x = this.x - PLAYER_STEP_X;
    console.log(`new_x: ${new_x}`);
    if (new_x >= -2 && new_x <= 402) {
      this.x = new_x;
    }
  }

  moveRight() {
    let new_x = this.x + PLAYER_STEP_X;
    if (new_x >= -2 && new_x <= 402) {
      this.x = new_x;
    }
  }

  moveUp() {
    let new_y = this.y - PLAYER_STEP_Y;
    if (new_y >= -15 && new_y <= 440) {
      this.y = new_y;
    }
    if (this.y == -15) {
      // The player reaches the water, show message
      updateStatus('You Won!', 'green-text text-accent-2');
      setTimeout(() => {
        // reset player position and re-initialize number of lives
        this.resetPosition();
        numLives = MAX_LIVES;
        updateStatus('New Game Starts!');
      }, 1000);
    }
  }

  moveDown() {
    let new_y = this.y + PLAYER_STEP_Y;
    // check if the new Y is with in the canvas of the game
    if (new_y >= 20 && new_y <= 440) {
      this.y = new_y;
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

// Update lives and pop-up message with Materialize CSS Toast
function updateStatus(message = '', classes = '') {
  lives.innerHTML = numLives;
  if (message !== '' && classes !== '') {
    M.toast({ html: message, displayLength: 1000, classes: classes });
  } else if (message !== '') {
    M.toast({ html: message, displayLength: 1000 });
  }
}

// Start the game
// Initialize player
const player = new Player();

// Initialize allEnemies
const allEnemies = [];

for (let n = 0; n < NUM_ENEMIES; n++) {
  let tileY, enemy;
  tileY = ENEMY_Y_POSITIONS[n % 3];
  enemy = new Enemy(10, tileY);
  allEnemies.push(enemy);
}

// Add event listener to player
document.addEventListener('keyup', function(e) {
  // Using 'shift' key (key code 16) to change the player character
  var allowedKeys = {
    16: 'change',
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };
  player.handleInput(allowedKeys[e.keyCode]);
});

restart.addEventListener('click', () => {
  updateStatus('Restart the game!');
  setTimeout(() => {
    window.location.reload();
  }, 500);
});

updateStatus();
