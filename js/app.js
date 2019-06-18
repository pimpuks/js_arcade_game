'use strict';

const PLAYER_STEP_X = 101;
const PLAYER_STEP_Y = 83;
const MAX_LIVES = 6;
const NUM_ENEMIES = 5;
const NUM_HEARTS = 2;
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

class ExtraObject extends Object {
  constructor(sprite, x, y) {
    super();
    this.sprite = sprite;
    if (isNaN(x)) {
      this.x = randomInt(20, 390);
    } else {
      this.x = x;
    }
    if (isNaN(y)) {
      this.y = randomInt(60, 300);
    } else {
      this.y = y;
    }
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}
class Enemy extends Object {
  constructor(x, y) {
    super();
    this.sprite = 'images/enemy-bug.png';
    this.x = x;
    this.y = y;
    this.speed = this.randomSpeed();
  }

  randomSpeed() {
    // return Math.floor(Math.random() * Math.floor(150)) + 100;
    return randomInt(100, 250);
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
      updateStatus(
        `Collision! ${numLives} lives left.`,
        'amber-text text-accent-3'
      );
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
    resetGame();
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
      // console.log('check heart collection');
      hearts.forEach(function(heart, index, hearts) {
        player.detectCollection(heart, index, hearts);
        // console.log('after detect collection');
        // console.log(hearts);
      });
    }
  }

  detectCollection(object, index, array) {
    let maxLeftX, maxRightX, maxTopY, maxBottomY;
    maxLeftX = object.x - 70;
    maxRightX = object.x + 70;
    maxTopY = object.y - 60;
    maxBottomY = object.y + 60;

    if (
      this.x > maxLeftX &&
      this.x < maxRightX &&
      this.y > maxTopY &&
      this.y < maxBottomY
    ) {
      numLives += 1;
      updateStatus('1 life added!');
      array.splice(index, 1);
    }
  }
  moveLeft() {
    let new_x = this.x - PLAYER_STEP_X;
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
        populateHearts();
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

// Generate random integer between min anc max value
function randomInt(min, max) {
  // return Math.floor(Math.random() * Math.floor(max));
  return Math.floor(Math.random() * (max - min + 1) + min);
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

function populateEnemies() {
  for (let n = 0; n < NUM_ENEMIES; n++) {
    let tileY, enemy;
    tileY = ENEMY_Y_POSITIONS[n % 3];
    enemy = new Enemy(10, tileY);
    allEnemies.push(enemy);
  }
}

function populateHearts() {
  // clean up existing items in the hearts array
  hearts.splice(0, hearts.length);
  let x;
  for (let n = 0; n < NUM_HEARTS; n++) {
    if (n % 2 == 0) {
      x = randomInt(20, 200);
    } else {
      x = randomInt(235, 390);
    }
    let heart = new ExtraObject('images/Heart.png', x);
    hearts.push(heart);
  }
}

function resetGame() {
  player.resetPosition();
  populateHearts();
  numLives = MAX_LIVES;
  updateStatus();
}
// Start the game
// Initialize player
const player = new Player();

// Initialize allEnemies
const allEnemies = [];

// Initialize hearts
const hearts = [];

populateEnemies();
populateHearts();

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

// Display number of lives
updateStatus();
