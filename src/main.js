import GameEngine from './engine/GameEngine.js';
import Snake from './entities/Snake.js';
import Food from './entities/Food.js';
import PowerUp from './entities/PowerUp.js';
import Obstacle from './entities/Obstacle.js';
import Portal from './entities/Portal.js';
import HUD from './ui/HUD.js';
import SettingsMenu from './ui/SettingsMenu.js';
import InputManager from './input/InputManager.js';
import AudioManager from './audio/AudioManager.js';
import Y8Service from './services/Y8Service.js';
import TerritoryManager from './utils/TerritoryManager.js';
import ParticleSystem from './effects/ParticleSystem.js';
import { GRID_SIZE, INITIAL_SNAKE_LENGTH, GAME_SPEED, BOARD_WIDTH, BOARD_HEIGHT, DIFFICULTY_SPEEDS } from './config.js';

// Game state
let gameState = {
    score: 0,
    level: 1,
    speedMultiplier: 1,
    pointMultiplier: 1,
    invincible: false,
    gameMode: 'classic',
    difficulty: 'normal',
    paused: false,
    gameStarted: false
};

// DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const levelElement = document.getElementById('level');
const speedElement = document.getElementById('speed');
const difficultyElement = document.getElementById('difficulty');
const evolutionElement = document.getElementById('evolution');
const abilityElement = document.getElementById('ability');
const territoryElement = document.getElementById('territory');
const overlayElement = document.getElementById('gameOverlay');

// Game objects
let highScore = Number(localStorage.getItem('snakeHighScore')) || 0;
let snake, food, powerUps, obstacles, portals, territoryManager, particles, engine, hud, input, audio, y8Service, settingsMenu;

// Initialize game
async function initGame() {
    // Initialize services
    audio = new AudioManager();
    y8Service = new Y8Service();
    await y8Service.init();
    
    // Initialize game objects
    snake = new Snake(Math.floor(BOARD_WIDTH/2), Math.floor(BOARD_HEIGHT/2), INITIAL_SNAKE_LENGTH);
    food = new Food(BOARD_WIDTH, BOARD_HEIGHT);
    powerUps = [];
    obstacles = [];
    portals = [];
    territoryManager = new TerritoryManager(BOARD_WIDTH, BOARD_HEIGHT);
    particles = new ParticleSystem();
    
    // Initialize UI
    hud = new HUD(scoreElement, highScoreElement, overlayElement);
    settingsMenu = new SettingsMenu(audio, handleSettingsChange);
    input = new InputManager();
    
    // Setup input
    input.onDirectionChange(dir => {
        if (!gameState.paused) {
            snake.setDirection(dir);
            // Start the game when player first moves
            if (!gameState.gameStarted) {
                gameState.gameStarted = true;
                hud.hideOverlay();
            }
        }
    });

    // Add pause functionality and special abilities
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Space' || e.code === 'KeyP') {
            e.preventDefault();
            if (gameState.gameStarted && !gameState.paused) {
                gameState.paused = true;
                hud.showOverlay('Game Paused', 'Press SPACE or P to resume', 'Resume', () => {
                    gameState.paused = false;
                    hud.hideOverlay();
                });
            } else if (gameState.gameStarted && gameState.paused) {
                gameState.paused = false;
                hud.hideOverlay();
            }
        }
        
        // Special ability activation
        if (e.code === 'KeyX' && gameState.gameStarted && !gameState.paused) {
            e.preventDefault();
            const abilityUsed = snake.useAbility(gameState, BOARD_WIDTH, BOARD_HEIGHT);
            if (abilityUsed) {
                audio.playPowerUp();
                updateDisplay();
            }
        }
    });
    
    // Setup mobile controls
    setupMobileControls();
    
    // Update display
    updateDisplay();
    
    // Start game
    startGame();
}

function handleSettingsChange(settings) {
    // Apply difficulty setting
    gameState.difficulty = settings.difficulty;
    
    // Apply theme
    document.body.className = `theme-${settings.theme}`;
    
    // Update display to show new speed
    updateDisplay();
}

function setupMobileControls() {
    const upBtn = document.getElementById('upBtn');
    const downBtn = document.getElementById('downBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    
    upBtn?.addEventListener('click', () => input.onDirectionChange({x: 0, y: -1}));
    downBtn?.addEventListener('click', () => input.onDirectionChange({x: 0, y: 1}));
    leftBtn?.addEventListener('click', () => input.onDirectionChange({x: -1, y: 0}));
    rightBtn?.addEventListener('click', () => input.onDirectionChange({x: 1, y: 0}));
}

function startGame() {
    resetGame();
    engine = new GameEngine(update, render, () => gameState);
    engine.start();
    y8Service.trackGameStart();
}

function resetGame() {
    gameState = {
        score: 0,
        level: 1,
        speedMultiplier: 1,
        pointMultiplier: 1,
        invincible: false,
        gameMode: 'classic',
        difficulty: 'normal',
        paused: false,
        gameStarted: false
    };
    
    snake.reset(Math.floor(BOARD_WIDTH/2), Math.floor(BOARD_HEIGHT/2), INITIAL_SNAKE_LENGTH);
    food.respawn(snake.body);
    powerUps = [];
    obstacles = [];
    portals = [];
    territoryManager.reset();
    
    updateDisplay();
    
    // Show start screen with comprehensive instructions
    hud.showOverlay('🐍 Snake Adventure - Enhanced Edition', 
        `🎮 CONTROLS:
        • Arrow Keys: Move snake
        • X: Use special ability
        • Space/P: Pause game
        
        🌟 UNIQUE FEATURES:
        • Evolution: Snake evolves as it grows!
        • Portals: Teleport through magical portals!
        • Territory: Claim areas by making loops!
        
        Press any arrow key to start!`, 
        'Start Game', () => {
            gameState.gameStarted = true;
            hud.hideOverlay();
        });
}

function update(delta) {
    if (gameState.paused || !gameState.gameStarted) return;
    
    // Update portals
    portals.forEach(portal => portal.update(delta));
    
    // Update particles
    particles.update(delta);
    
    // Update snake
    snake.update();
    
    // Check collisions
    const head = snake.getHead();
    
            // Territory system completely disabled - no traces, no popups, no scoring
    
    // Wall collision (unless invincible or Swift Snake)
    if (!gameState.invincible && snake.evolutionStage !== 'juvenile' && 
        (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT)) {
        gameOver();
        return;
    }
    
    // Swift Snake wall wrapping - if it goes through walls, wrap it to the other side
    if (snake.evolutionStage === 'juvenile' && 
        (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT)) {
        // Wrap the snake head to the opposite side
        if (head.x < 0) head.x = BOARD_WIDTH - 1;
        else if (head.x >= BOARD_WIDTH) head.x = 0;
        if (head.y < 0) head.y = BOARD_HEIGHT - 1;
        else if (head.y >= BOARD_HEIGHT) head.y = 0;
    }
    
    // Self collision (unless invincible) - but only if snake has moved and has multiple segments
    if (!gameState.invincible && snake.hasMoved() && snake.body.length > 1 && snake.checkSelfCollision()) {
        gameOver();
        return;
    }
    
    // Obstacle collision
    if (!gameState.invincible && obstacles.some(obstacle => obstacle.collidesWith(head))) {
        gameOver();
        return;
    }
    
    // Portal collision
    portals.forEach(portal => {
        if (portal.teleport(snake)) {
            audio.playPowerUp();
            // Spawn new portal pair after using one
            setTimeout(() => {
                if (Math.random() < 0.3) { // 30% chance to spawn new portals
                    spawnPortals();
                }
            }, 2000);
        }
    });
    
    // Food collision
    if (head.x === food.position.x && head.y === food.position.y) {
        snake.grow();
        gameState.score += 10 * gameState.pointMultiplier;
        food.respawn(snake.body);
        audio.playEat();
        y8Service.trackFoodEaten(gameState.score);
        
        // Check for evolution - much rarer now
        const evolutionStage = snake.checkEvolution();
        if (evolutionStage) {
            const evolutionInfo = snake.getEvolutionInfo();
            
            // Create evolution particle effect
            particles.createEvolutionEffect(head.x * GRID_SIZE + GRID_SIZE/2, head.y * GRID_SIZE + GRID_SIZE/2);
            
            // Show evolution notification but don't pause game - auto-dismiss after 3 seconds
            hud.showOverlay(`🐍 Evolution!`, 
                `Your snake evolved into:\n${evolutionInfo.name}\n\n${evolutionInfo.description}\n\nPress X to use special ability!`, 
                'Got it!', () => {
                    hud.hideOverlay();
                });
            
            // Auto-dismiss evolution popup after 3 seconds
            setTimeout(() => {
                hud.hideOverlay();
            }, 3000);
            
            audio.playLevelUp();
        }
        
        // Check for level up
        if (gameState.score % 100 === 0) {
            levelUp();
        }
        
        // Random power-up spawn
        if (Math.random() < 0.1) {
            spawnPowerUp();
        }
        
        // Random obstacle spawn (harder levels)
        if (gameState.level > 3 && Math.random() < 0.05) {
            spawnObstacle();
        }
        
        // Random portal spawn (mid-game)
        if (gameState.level > 2 && portals.length === 0 && Math.random() < 0.15) {
            spawnPortals();
        }
        
        updateDisplay();
        
        // Show ad every 200 points
        if (gameState.score % 200 === 0) {
            y8Service.showAd();
        }
    }
    
    // Power-up collision
    powerUps = powerUps.filter(powerUp => {
        if (head.x === powerUp.x && head.y === powerUp.y && powerUp.active) {
            powerUp.apply(snake, gameState);
            audio.playPowerUp();
            y8Service.trackPowerUpCollected(powerUp.type);
            powerUp.active = false;
            return false;
        }
        return true;
    });
    
    // Remove expired power-ups
    powerUps.forEach(powerUp => {
        if (powerUp.isExpired()) {
            powerUp.remove(gameState);
        }
    });
    powerUps = powerUps.filter(powerUp => !powerUp.isExpired());
}

function render() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background grid
    drawGrid();
    
    // Territory system is active but invisible - no visual traces
    // The territory claiming still works for scoring but doesn't show on screen
    
    // Draw obstacles
    obstacles.forEach(obstacle => {
        ctx.fillStyle = '#666';
        ctx.fillRect(obstacle.x * GRID_SIZE, obstacle.y * GRID_SIZE, 
                    obstacle.width * GRID_SIZE, obstacle.height * GRID_SIZE);
    });
    
    // Draw portals
    portals.forEach(portal => {
        ctx.fillStyle = portal.getAnimatedColor();
        ctx.fillRect(portal.x * GRID_SIZE, portal.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        
        // Add portal effect
        if (portal.isReady()) {
            ctx.shadowColor = portal.color;
            ctx.shadowBlur = 15;
            ctx.fillRect(portal.x * GRID_SIZE + 2, portal.y * GRID_SIZE + 2, GRID_SIZE - 6, GRID_SIZE - 6);
            ctx.shadowBlur = 0;
        }
    });
    
    // Draw snake with evolution colors
    const evolutionInfo = snake.getEvolutionInfo();
    snake.body.forEach((segment, i) => {
        if (gameState.invincible && i === 0) {
            // Flash effect for invincible head
            ctx.fillStyle = Date.now() % 200 < 100 ? '#FFD700' : '#FF6347';
        } else if (gameState.phaseMode && i === 0) {
            // Phase mode effect - keep snake visible but with glow effect
            ctx.fillStyle = evolutionInfo.color;
            ctx.shadowColor = '#FFD700';
            ctx.shadowBlur = 15;
        } else {
            ctx.fillStyle = i === 0 ? '#FF6347' : evolutionInfo.color;
        }
        ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        
        // Add special effects for legendary snake
        if (snake.evolutionStage === 'legendary' && i === 0) {
            ctx.shadowColor = evolutionInfo.color;
            ctx.shadowBlur = 10;
            ctx.fillRect(segment.x * GRID_SIZE, segment.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
            ctx.shadowBlur = 0;
        }
        
        // Reset shadow for phase mode
        if (gameState.phaseMode && i === 0) {
            ctx.shadowBlur = 0;
        }
    });
    
    // Draw food
    ctx.fillStyle = '#FF6347'; // Tomato Red - softer than bright red
    ctx.fillRect(food.position.x * GRID_SIZE, food.position.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
    
    // Draw power-ups
    powerUps.forEach(powerUp => {
        if (powerUp.active) {
            ctx.fillStyle = powerUp.getColor();
            ctx.fillRect(powerUp.x * GRID_SIZE, powerUp.y * GRID_SIZE, GRID_SIZE - 2, GRID_SIZE - 2);
        }
    });
    
    // Draw particles
    particles.render(ctx);
}

function drawGrid() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 1;
    for (let i = 0; i <= BOARD_WIDTH; i++) {
        ctx.beginPath();
        ctx.moveTo(i * GRID_SIZE, 0);
        ctx.lineTo(i * GRID_SIZE, canvas.height);
        ctx.stroke();
    }
    for (let i = 0; i <= BOARD_HEIGHT; i++) {
        ctx.beginPath();
        ctx.moveTo(0, i * GRID_SIZE);
        ctx.lineTo(canvas.width, i * GRID_SIZE);
        ctx.stroke();
    }
}

function spawnPowerUp() {
    let x, y;
    do {
        x = Math.floor(Math.random() * BOARD_WIDTH);
        y = Math.floor(Math.random() * BOARD_HEIGHT);
    } while (snake.body.some(segment => segment.x === x && segment.y === y) ||
             (food.position.x === x && food.position.y === y) ||
             powerUps.some(p => p.x === x && p.y === y));
    
    powerUps.push(new PowerUp(x, y, PowerUp.getRandomType()));
}

function spawnObstacle() {
    const obstacle = Obstacle.generateRandom(BOARD_WIDTH, BOARD_HEIGHT, snake.body);
    obstacles.push(obstacle);
}

function spawnPortals() {
    const portalPair = Portal.createPortalPair(BOARD_WIDTH, BOARD_HEIGHT, snake.body);
    if (portalPair) {
        portals.push(...portalPair);
        
        // Show notification and pause game
        gameState.paused = true;
        hud.showOverlay('🌀 Portals Appeared!', 
            'Step into a portal to teleport!\nPortals will disappear after some time.', 
            'Got it!', () => {
                hud.hideOverlay();
                gameState.paused = false; // Resume game after clicking continue
            });
        
        // Remove portals after 15 seconds
        setTimeout(() => {
            portals.length = 0;
        }, 15000);
    }
}

function levelUp() {
    gameState.level++;
    
    // Gradual speed increase - only increase speed every 3 levels
    if (gameState.level % 3 === 0) {
        const difficultyMultiplier = DIFFICULTY_SPEEDS[gameState.difficulty] || 1.0;
        gameState.speedMultiplier = Math.min(2.5, difficultyMultiplier + (gameState.level * 0.05));
    }
    
    audio.playLevelUp();
    y8Service.trackLevelUp(gameState.level);
    updateDisplay();
}

function gameOver() {
    engine.stop();
    audio.playGameOver();
    
    if (gameState.score > highScore) {
        highScore = gameState.score;
        localStorage.setItem('snakeHighScore', highScore);
        y8Service.trackHighScore(highScore);
    }
    
    y8Service.trackGameOver(gameState.score, gameState.level);
    
    hud.showOverlay('Game Over!', 
        `Final Score: ${gameState.score}\nLevel: ${gameState.level}\nHigh Score: ${highScore}`, 
        'Play Again', () => {
            resetGame();
            engine.start();
            hud.hideOverlay();
        });
}

function updateDisplay() {
    hud.setScore(gameState.score);
    hud.setHighScore(highScore);
    if (levelElement) {
        levelElement.textContent = gameState.level;
    }
    if (speedElement) {
        const difficultyMultiplier = DIFFICULTY_SPEEDS[gameState.difficulty] || 1.0;
        const totalSpeed = (gameState.speedMultiplier * difficultyMultiplier).toFixed(1);
        speedElement.textContent = totalSpeed + 'x';
        speedElement.style.color = '#98FB98'; // Light Green - softer than cyan
    }
    if (difficultyElement) {
        const difficultyNames = {
            easy: 'Easy',
            normal: 'Normal',
            hard: 'Hard'
        };
        difficultyElement.textContent = difficultyNames[gameState.difficulty] || 'Normal';
        difficultyElement.style.color = '#FFB6C1'; // Light Pink - softer than red
    }
    if (evolutionElement) {
        const evolutionInfo = snake.getEvolutionInfo();
        evolutionElement.textContent = evolutionInfo.name;
        evolutionElement.style.color = evolutionInfo.color;
    }
    if (abilityElement) {
        if (snake.specialAbility && snake.abilityCharges > 0) {
            const abilityNames = {
                dash: 'Dash',
                phase: 'Phase',
                teleport: 'Teleport'
            };
            abilityElement.textContent = `${abilityNames[snake.specialAbility]} (${snake.abilityCharges})`;
            abilityElement.style.color = '#32CD32'; // Lime Green - softer than bright green
        } else {
            abilityElement.textContent = 'None (0)';
            abilityElement.style.color = '#A9A9A9'; // Dark Gray - softer than pure gray
        }
    }
    if (territoryElement) {
        territoryElement.textContent = '0%';
        territoryElement.style.color = '#87CEEB'; // Sky Blue
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        gameState.paused = true;
    } else {
        gameState.paused = false;
    }
});

// Handle window focus/blur
window.addEventListener('focus', () => {
    gameState.paused = false;
});

window.addEventListener('blur', () => {
    gameState.paused = true;
});

// Add settings button to header
document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.game-header');
    if (header) {
        const settingsBtn = document.createElement('button');
        settingsBtn.className = 'settings-btn';
        settingsBtn.innerHTML = '⚙️';
        settingsBtn.title = 'Settings';
        settingsBtn.onclick = () => settingsMenu.show();
        header.appendChild(settingsBtn);
    }
});