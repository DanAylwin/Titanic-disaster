const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

const mainMenu = document.getElementById('main-menu');
const gameScreen = document.getElementById('game-screen');
const pauseMenu = document.getElementById('pause-menu');
const gameOverScreen = document.getElementById('game-over-screen');

const startButton = document.getElementById('start-button');
const quitButton = document.getElementById('quit-button');
const pauseButton = document.getElementById('pause-button');
const resumeButton = document.getElementById('resume-button');
const mainMenuButton = document.getElementById('main-menu-button');
const restartButton = document.getElementById('restart-button');
const gameOverMainMenuButton = document.getElementById('game-over-main-menu-button');

const heartsDisplay = document.getElementById('hearts');
const distanceDisplay = document.getElementById('distance');
const finalScoreDisplay = document.getElementById('final-score');

let titanic;
let icebergs = [];
let distance = 0;
let hearts = 3;
let difficulty = 1;
let paused = false;
let gameOver = false;
let collisionPause = false;
let animationFrame;

const titanicImage = new Image();
titanicImage.src = 'titanic.png'; // You'll need to create this image

const icebergImage = new Image();
icebergImage.src = 'iceberg.png'; // You'll need to create this image

const backgroundImage = new Image();
backgroundImage.src = 'ocean_background.png'; // You'll need to create this image

class Titanic {
    constructor() {
        this.width = 120;
        this.height = 60;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 5;
    }

    draw() {
        ctx.drawImage(titanicImage, this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction.includes('left') && this.x > 0) {
            this.x -= this.speed;
        }
        if (direction.includes('right') && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
        if (direction.includes('up') && this.y > 0) {
            this.y -= this.speed;
        }
        if (direction.includes('down') && this.y < canvas.height - this.height) {
            this.y += this.speed;
        }
    }
}

class Iceberg {
    constructor() {
        this.width = 80;
        this.height = 80;
        this.x = Math.random() * (canvas.width - this.width);
        this.y = -this.height;
        this.speed = 1 + Math.random() * 1;
    }

    draw() {
        ctx.drawImage(icebergImage, this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
    }
}

function startGame() {
    console.log("Starting game...");
    mainMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    titanic = new Titanic();
    icebergs = [];
    distance = 0;
    hearts = 3;
    difficulty = 1;
    paused = false;
    gameOver = false;
    updateUI();
    animationFrame = requestAnimationFrame(gameLoop);
    console.log("Game started");
}

function gameLoop(timestamp) {
    if (paused || gameOver) {
        return;
    }

    update();
    draw();

    animationFrame = requestAnimationFrame(gameLoop);
}

function update() {
    if (collisionPause) return;

    gameInput();

    if (Math.random() < 0.02 * difficulty) {
        icebergs.push(new Iceberg());
    }

    for (let i = icebergs.length - 1; i >= 0; i--) {
        icebergs[i].move();

        if (checkCollision(titanic, icebergs[i])) {
            hearts--;
            icebergs.splice(i, 1);
            updateUI();
            showExplosion();
            if (hearts === 0) {
                endGame();
            }
        } else if (icebergs[i].y > canvas.height) {
            icebergs.splice(i, 1);
        }
    }

    distance += 1 / 60;
    difficulty += 0.0002;
    updateUI();
}

function draw() {
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

    titanic.draw();

    for (let iceberg of icebergs) {
        iceberg.draw();
    }
}

function checkCollision(titanic, iceberg) {
    return (
        titanic.x < iceberg.x + iceberg.width &&
        titanic.x + titanic.width > iceberg.x &&
        titanic.y < iceberg.y + iceberg.height &&
        titanic.y + titanic.height > iceberg.y
    );
}

function showExplosion() {
    collisionPause = true;
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(titanic.x + titanic.width / 2, titanic.y + titanic.height / 2, 30, 0, Math.PI * 2);
    ctx.fill();
    setTimeout(() => {
        collisionPause = false;
    }, 500);
}

function updateUI() {
    heartsDisplay.textContent = '❤'.repeat(hearts);
    distanceDisplay.textContent = `Distance: ${Math.floor(distance)} km`;
}

function endGame() {
    gameOver = true;
    cancelAnimationFrame(animationFrame);
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreDisplay.textContent = `Final Distance: ${Math.floor(distance)} km`;
}

function pauseGame() {
    paused = true;
    cancelAnimationFrame(animationFrame);
    gameScreen.classList.add('hidden');
    pauseMenu.classList.remove('hidden');
}

function resumeGame() {
    paused = false;
    pauseMenu.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    animationFrame = requestAnimationFrame(gameLoop);
}

function showMainMenu() {
    cancelAnimationFrame(animationFrame);
    gameScreen.classList.add('hidden');
    pauseMenu.classList.add('hidden');
    gameOverScreen.classList.add('hidden');
    mainMenu.classList.remove('hidden');
}

// Event Listeners
startButton.addEventListener('click', startGame);
quitButton.addEventListener('click', () => window.close());
pauseButton.addEventListener('click', pauseGame);
resumeButton.addEventListener('click', resumeGame);
mainMenuButton.addEventListener('click', showMainMenu);
restartButton.addEventListener('click', startGame);
gameOverMainMenuButton.addEventListener('click', showMainMenu);

const keys = {};
document.addEventListener('keydown', (e) => {
    keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});

function gameInput() {
    if (!paused && !gameOver && !collisionPause) {
        const direction = [];
        if (keys['ArrowLeft']) direction.push('left');
        if (keys['ArrowRight']) direction.push('right');
        if (keys['ArrowUp']) direction.push('up');
        if (keys['ArrowDown']) direction.push('down');
        if (direction.length > 0) {
            titanic.move(direction);
        }
    }
}

// Initialize the game
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM content loaded");
});