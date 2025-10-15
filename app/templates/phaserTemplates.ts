// 90s Arcade Game Templates for Phaser.js

export interface GameTemplate {
  type: 'platformer' | 'top-down' | 'obstacle-avoider';
  description: string;
  baseCode: string;
  htmlWrapper: string;
}

// Platformer Template
export const platformerTemplate: GameTemplate = {
  type: 'platformer',
  description: 'Side-scrolling platformer with jumping and collecting',
  baseCode: `
// Phaser 3 Platformer Game
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let collectibles;
let obstacles;
let score = 0;
let scoreText;
let gameOver = false;

function preload() {
  // Placeholder graphics (will be replaced with generated assets)
  // For MVP, we use simple shapes
}

function create() {
  // Background
  this.add.rectangle(400, 300, 800, 600, 0x87CEEB);
  
  // Platforms
  platforms = this.physics.add.staticGroup();
  platforms.create(400, 568, null).setDisplaySize(800, 32).setTint(0x00ff00);
  platforms.create(600, 400, null).setDisplaySize(200, 32).setTint(0x00ff00);
  platforms.create(50, 250, null).setDisplaySize(200, 32).setTint(0x00ff00);
  platforms.create(750, 220, null).setDisplaySize(200, 32).setTint(0x00ff00);
  
  // Player
  player = this.physics.add.sprite(100, 450, null).setDisplaySize(32, 32).setTint(0xff0000);
  player.setBounce(0.2);
  player.setCollideWorldBounds(true);
  
  // Collectibles
  collectibles = this.physics.add.group();
  for (let i = 0; i < 8; i++) {
    const x = Phaser.Math.Between(50, 750);
    const collectible = collectibles.create(x, 0, null).setDisplaySize(20, 20).setTint(0xffff00);
    collectible.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
  }
  
  // Score
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
  
  // Collisions
  this.physics.add.collider(player, platforms);
  this.physics.add.collider(collectibles, platforms);
  this.physics.add.overlap(player, collectibles, collectItem, null, this);
  
  // Controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) {
    return;
  }
  
  // Player movement
  if (cursors.left.isDown) {
    player.setVelocityX(-160);
  } else if (cursors.right.isDown) {
    player.setVelocityX(160);
  } else {
    player.setVelocityX(0);
  }
  
  // Jump
  if (cursors.up.isDown && player.body.touching.down) {
    player.setVelocityY(-330);
  }
}

function collectItem(player, collectible) {
  collectible.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
  
  if (collectibles.countActive(true) === 0) {
    // Game won!
    showGameOver('You Win!', this);
  }
}

function showGameOver(message, scene) {
  gameOver = true;
  const text = scene.add.text(400, 300, message, { fontSize: '64px', fill: '#fff' });
  text.setOrigin(0.5);
  
  const playAgainBtn = scene.add.text(400, 400, 'Play Again', { fontSize: '32px', fill: '#0f0' });
  playAgainBtn.setOrigin(0.5);
  playAgainBtn.setInteractive();
  playAgainBtn.on('pointerdown', () => {
    window.location.reload();
  });
}

let cursors;
`,
  htmlWrapper: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game</title>
  <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
  <style>
    body {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      background-color: #000;
    }
    #game-container {
      max-width: 100%;
      max-height: 100%;
    }
  </style>
</head>
<body>
  <div id="game-container"></div>
  <script>
    {{GAME_CODE}}
  </script>
</body>
</html>
`,
};

// Top-down Collection Game Template
export const topDownTemplate: GameTemplate = {
  type: 'top-down',
  description: 'Top-down view collection game',
  baseCode: `
// Phaser 3 Top-Down Collection Game
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let collectibles;
let obstacles;
let score = 0;
let scoreText;
let timeText;
let gameTime = 60;
let gameOver = false;

function preload() {
  // Placeholder graphics
}

function create() {
  // Background
  this.add.rectangle(400, 300, 800, 600, 0x228B22);
  
  // Player
  player = this.physics.add.sprite(400, 300, null).setDisplaySize(40, 40).setTint(0xff0000);
  player.setCollideWorldBounds(true);
  
  // Collectibles
  collectibles = this.physics.add.group();
  for (let i = 0; i < 15; i++) {
    const x = Phaser.Math.Between(50, 750);
    const y = Phaser.Math.Between(50, 550);
    collectibles.create(x, y, null).setDisplaySize(20, 20).setTint(0xffff00);
  }
  
  // Obstacles
  obstacles = this.physics.add.group();
  for (let i = 0; i < 5; i++) {
    const x = Phaser.Math.Between(100, 700);
    const y = Phaser.Math.Between(100, 500);
    const obstacle = obstacles.create(x, y, null).setDisplaySize(30, 30).setTint(0x800080);
    obstacle.setVelocity(Phaser.Math.Between(-50, 50), Phaser.Math.Between(-50, 50));
    obstacle.setBounce(1);
    obstacle.setCollideWorldBounds(true);
  }
  
  // UI
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '24px', fill: '#fff' });
  timeText = this.add.text(16, 50, 'Time: 60', { fontSize: '24px', fill: '#fff' });
  
  // Collisions
  this.physics.add.overlap(player, collectibles, collectItem, null, this);
  this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
  this.physics.add.collider(obstacles, obstacles);
  
  // Timer
  this.time.addEvent({
    delay: 1000,
    callback: updateTimer,
    callbackScope: this,
    loop: true
  });
  
  // Controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) {
    return;
  }
  
  // Player movement
  player.setVelocity(0);
  
  if (cursors.left.isDown) {
    player.setVelocityX(-200);
  } else if (cursors.right.isDown) {
    player.setVelocityX(200);
  }
  
  if (cursors.up.isDown) {
    player.setVelocityY(-200);
  } else if (cursors.down.isDown) {
    player.setVelocityY(200);
  }
}

function collectItem(player, collectible) {
  collectible.disableBody(true, true);
  score += 10;
  scoreText.setText('Score: ' + score);
  
  if (collectibles.countActive(true) === 0) {
    showGameOver('You Win!', this);
  }
}

function hitObstacle(player, obstacle) {
  score = Math.max(0, score - 5);
  scoreText.setText('Score: ' + score);
  player.setTint(0xff0000);
  this.time.delayedCall(200, () => player.clearTint());
}

function updateTimer() {
  if (!gameOver) {
    gameTime--;
    timeText.setText('Time: ' + gameTime);
    
    if (gameTime <= 0) {
      showGameOver('Time Up! Final Score: ' + score, this);
    }
  }
}

function showGameOver(message, scene) {
  gameOver = true;
  const text = scene.add.text(400, 300, message, { fontSize: '48px', fill: '#fff' });
  text.setOrigin(0.5);
  
  const playAgainBtn = scene.add.text(400, 380, 'Play Again', { fontSize: '32px', fill: '#0f0' });
  playAgainBtn.setOrigin(0.5);
  playAgainBtn.setInteractive();
  playAgainBtn.on('pointerdown', () => {
    window.location.reload();
  });
}

let cursors;
`,
  htmlWrapper: platformerTemplate.htmlWrapper, // Reuse same HTML wrapper
};

// Obstacle Avoider Template
export const obstacleAvoiderTemplate: GameTemplate = {
  type: 'obstacle-avoider',
  description: 'Fast-paced obstacle avoidance game',
  baseCode: `
// Phaser 3 Obstacle Avoider Game
const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  parent: 'game-container',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: {
    preload: preload,
    create: create,
    update: update
  }
};

const game = new Phaser.Game(config);

let player;
let obstacles;
let score = 0;
let scoreText;
let gameOver = false;
let speed = 200;

function preload() {
  // Placeholder graphics
}

function create() {
  // Background
  this.add.rectangle(400, 300, 800, 600, 0x1E90FF);
  
  // Player
  player = this.physics.add.sprite(100, 300, null).setDisplaySize(40, 40).setTint(0xff0000);
  player.setCollideWorldBounds(true);
  
  // Obstacles
  obstacles = this.physics.add.group();
  
  // Score
  scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });
  
  // Spawn obstacles
  this.time.addEvent({
    delay: 1500,
    callback: spawnObstacle,
    callbackScope: this,
    loop: true
  });
  
  // Update score
  this.time.addEvent({
    delay: 100,
    callback: () => {
      if (!gameOver) {
        score += 1;
        scoreText.setText('Score: ' + score);
        
        // Increase difficulty
        if (score % 100 === 0) {
          speed += 20;
        }
      }
    },
    callbackScope: this,
    loop: true
  });
  
  // Collisions
  this.physics.add.overlap(player, obstacles, hitObstacle, null, this);
  
  // Controls
  cursors = this.input.keyboard.createCursorKeys();
}

function update() {
  if (gameOver) {
    return;
  }
  
  // Player movement
  if (cursors.up.isDown) {
    player.setVelocityY(-300);
  } else if (cursors.down.isDown) {
    player.setVelocityY(300);
  } else {
    player.setVelocityY(0);
  }
  
  // Remove off-screen obstacles
  obstacles.children.entries.forEach(obstacle => {
    if (obstacle.x < -50) {
      obstacle.destroy();
    }
  });
}

function spawnObstacle() {
  if (gameOver) return;
  
  const y = Phaser.Math.Between(50, 550);
  const height = Phaser.Math.Between(30, 80);
  const obstacle = obstacles.create(850, y, null).setDisplaySize(30, height).setTint(0x800080);
  obstacle.setVelocityX(-speed);
}

function hitObstacle() {
  gameOver = true;
  this.physics.pause();
  player.setTint(0xff0000);
  
  showGameOver('Game Over!', this);
}

function showGameOver(message, scene) {
  const text = scene.add.text(400, 250, message, { fontSize: '64px', fill: '#fff' });
  text.setOrigin(0.5);
  
  const scoreText = scene.add.text(400, 320, 'Final Score: ' + score, { fontSize: '32px', fill: '#fff' });
  scoreText.setOrigin(0.5);
  
  const playAgainBtn = scene.add.text(400, 400, 'Play Again', { fontSize: '32px', fill: '#0f0' });
  playAgainBtn.setOrigin(0.5);
  playAgainBtn.setInteractive();
  playAgainBtn.on('pointerdown', () => {
    window.location.reload();
  });
}

let cursors;
`,
  htmlWrapper: platformerTemplate.htmlWrapper, // Reuse same HTML wrapper
};

// Template registry
export const gameTemplates: Record<string, GameTemplate> = {
  platformer: platformerTemplate,
  'top-down': topDownTemplate,
  'obstacle-avoider': obstacleAvoiderTemplate,
};

// Helper function to get template
export function getTemplate(type: 'platformer' | 'top-down' | 'obstacle-avoider'): GameTemplate {
  return gameTemplates[type];
}

// Helper function to generate complete HTML with game code
export function generateGameHTML(template: GameTemplate, customCode?: string): string {
  const code = customCode || template.baseCode;
  return template.htmlWrapper.replace('{{GAME_CODE}}', code);
}

