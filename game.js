// Y8 SDK Integration and Game Logic
class SnakeGame {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.setResponsiveCanvas();
        this.gridSize = Math.floor(this.canvas.width / 20);
        this.tileCount = Math.floor(this.canvas.width / this.gridSize);
        
        // Game state
        this.gameRunning = false;
        this.score = 0;
        this.highScore = localStorage.getItem('snakeHighScore') || 0;
        
        // Snake properties
        this.snake = [{x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2)}];
        this.dx = 1; // Start moving right
        this.dy = 0;
        
        // Food properties
        this.food = this.generateFood();
        
        // Game speed
        this.gameSpeed = 150;
        this.lastTime = 0;
        
        // Initialize Y8 SDK
        this.initY8SDK();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Update display
        this.updateScoreDisplay();
        this.showStartScreen();
    }
    
    // Y8 SDK Integration
    initY8SDK() {
        // Initialize Y8 SDK when available
        if (typeof Y8 !== 'undefined') {
            Y8.init({
                appId: 'snake-adventure-game',
                onReady: () => {
                    console.log('Y8 SDK initialized');
                    this.loadUserData();
                },
                onError: (error) => {
                    console.error('Y8 SDK error:', error);
                }
            });
        } else {
            console.log('Y8 SDK not available, running in standalone mode');
        }
    }
    
    loadUserData() {
        if (typeof Y8 !== 'undefined' && Y8.user) {
            // Load user data from Y8
            Y8.user.getProfile().then(profile => {
                console.log('User profile loaded:', profile);
                // You can use profile data to personalize the game
                if (profile.nickname) {
                    document.querySelector('.game-title').textContent = `🐍 Snake Adventure - ${profile.nickname}`;
                }
            }).catch(error => {
                console.error('Error loading user profile:', error);
            });
        }
    }
    
    // Ad Integration Points
    showAd() {
        if (typeof Y8 !== 'undefined' && Y8.ads) {
            Y8.ads.showAd().then(() => {
                console.log('Ad displayed successfully');
            }).catch(error => {
                console.error('Error showing ad:', error);
            });
        }
    }
    
    // Game Events for Analytics
    trackGameEvent(eventName, data = {}) {
        if (typeof Y8 !== 'undefined' && Y8.analytics) {
            Y8.analytics.track(eventName, {
                ...data,
                timestamp: Date.now(),
                score: this.score
            });
        }
    }
    
    setupEventListeners() {
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            if (!this.gameRunning) return;
            
            switch(e.key) {
                case 'ArrowUp':
                    if (this.dy !== 1) {
                        this.dx = 0;
                        this.dy = -1;
                    }
                    break;
                case 'ArrowDown':
                    if (this.dy !== -1) {
                        this.dx = 0;
                        this.dy = 1;
                    }
                    break;
                case 'ArrowLeft':
                    if (this.dx !== 1) {
                        this.dx = -1;
                        this.dy = 0;
                    }
                    break;
                case 'ArrowRight':
                    if (this.dx !== -1) {
                        this.dx = 1;
                        this.dy = 0;
                    }
                    break;
            }
        });
        
        // Mobile controls
        document.getElementById('upBtn').addEventListener('click', () => {
            if (this.gameRunning && this.dy !== 1) {
                this.dx = 0;
                this.dy = -1;
            }
        });
        
        document.getElementById('downBtn').addEventListener('click', () => {
            if (this.gameRunning && this.dy !== -1) {
                this.dx = 0;
                this.dy = 1;
            }
        });
        
        document.getElementById('leftBtn').addEventListener('click', () => {
            if (this.gameRunning && this.dx !== 1) {
                this.dx = -1;
                this.dy = 0;
            }
        });
        
        document.getElementById('rightBtn').addEventListener('click', () => {
            if (this.gameRunning && this.dx !== -1) {
                this.dx = 1;
                this.dy = 0;
            }
        });
        
        // Game buttons
        document.getElementById('startButton').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('restartButton').addEventListener('click', () => {
            this.restartGame();
        });
    }
    
    startGame() {
        this.gameRunning = true;
        this.score = 0;
        this.snake = [{x: Math.floor(this.tileCount / 2), y: Math.floor(this.tileCount / 2)}];
        this.dx = 1; // Start moving right
        this.dy = 0;
        this.food = this.generateFood();
        this.gameSpeed = 150;
        
        this.hideOverlay();
        this.updateScoreDisplay();
        this.trackGameEvent('game_started');
        
        // Start game loop
        this.gameLoop();
    }
    
    restartGame() {
        this.startGame();
    }
    
    gameLoop(currentTime = 0) {
        if (!this.gameRunning) return;
        
        if (currentTime - this.lastTime > this.gameSpeed) {
            this.update();
            this.draw();
            this.lastTime = currentTime;
        }
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update() {
        // Move snake
        const head = {x: this.snake[0].x + this.dx, y: this.snake[0].y + this.dy};
        
        // Check wall collision
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount) {
            this.gameOver();
            return;
        }
        
        // Check self collision
        for (let i = 0; i < this.snake.length; i++) {
            if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
                this.gameOver();
                return;
            }
        }
        
        this.snake.unshift(head);
        
        // Check food collision
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            this.updateScoreDisplay();
            
            // Increase speed every 50 points
            if (this.score % 50 === 0) {
                this.gameSpeed = Math.max(50, this.gameSpeed - 10);
            }
            
            this.trackGameEvent('food_eaten', {score: this.score});
            
            // Show ad every 100 points
            if (this.score % 100 === 0) {
                this.showAd();
            }
        } else {
            this.snake.pop();
        }
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw snake
        this.ctx.fillStyle = '#4ecdc4';
        this.snake.forEach((segment, index) => {
            if (index === 0) {
                // Head
                this.ctx.fillStyle = '#ff6b6b';
            } else {
                // Body
                this.ctx.fillStyle = '#4ecdc4';
            }
            this.ctx.fillRect(segment.x * this.gridSize, segment.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        });
        
        // Draw food
        this.ctx.fillStyle = '#ff6b6b';
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        
        // Add glow effect to food
        this.ctx.shadowColor = '#ff6b6b';
        this.ctx.shadowBlur = 10;
        this.ctx.fillRect(this.food.x * this.gridSize, this.food.y * this.gridSize, this.gridSize - 2, this.gridSize - 2);
        this.ctx.shadowBlur = 0;
    }
    
    generateFood() {
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * this.tileCount),
                y: Math.floor(Math.random() * this.tileCount)
            };
        } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
        
        return food;
    }
    
    gameOver() {
        this.gameRunning = false;
        
        // Update high score
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('snakeHighScore', this.highScore);
            this.trackGameEvent('new_high_score', {score: this.score});
        }
        
        this.updateScoreDisplay();
        this.showGameOverScreen();
        this.trackGameEvent('game_over', {final_score: this.score});
    }
    
    showStartScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const startBtn = document.getElementById('startButton');
        const restartBtn = document.getElementById('restartButton');
        
        title.textContent = '🐍 Snake Adventure';
        message.textContent = 'Use arrow keys to control the snake. Eat food to grow and score points!';
        startBtn.style.display = 'inline-block';
        restartBtn.style.display = 'none';
        overlay.style.display = 'flex';
    }
    
    showGameOverScreen() {
        const overlay = document.getElementById('gameOverlay');
        const title = document.getElementById('overlayTitle');
        const message = document.getElementById('overlayMessage');
        const startBtn = document.getElementById('startButton');
        const restartBtn = document.getElementById('restartButton');
        
        title.textContent = 'Game Over!';
        message.textContent = `Final Score: ${this.score}\nHigh Score: ${this.highScore}`;
        startBtn.style.display = 'none';
        restartBtn.style.display = 'inline-block';
        overlay.style.display = 'flex';
    }
    
    hideOverlay() {
        document.getElementById('gameOverlay').style.display = 'none';
    }
    
    updateScoreDisplay() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('highScore').textContent = this.highScore;
    }

    setResponsiveCanvas() {
        // Set canvas size based on device
        const minSize = Math.min(window.innerWidth, window.innerHeight) * 0.9;
        let size = Math.max(400, Math.min(700, minSize));
        this.canvas.width = size;
        this.canvas.height = size;
    }
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', () => {
    const game = new SnakeGame();
    
    // Expose game instance globally for debugging
    window.snakeGame = game;
    window.addEventListener('resize', () => {
        game.setResponsiveCanvas();
        game.gridSize = Math.floor(game.canvas.width / 20);
        game.tileCount = Math.floor(game.canvas.width / game.gridSize);
    });
});

// Handle page visibility changes for Y8 integration
document.addEventListener('visibilitychange', () => {
    if (typeof Y8 !== 'undefined' && Y8.game) {
        if (document.hidden) {
            Y8.game.pause();
        } else {
            Y8.game.resume();
        }
    }
});

// Handle window focus/blur for Y8 integration
window.addEventListener('focus', () => {
    if (typeof Y8 !== 'undefined' && Y8.game) {
        Y8.game.resume();
    }
});

window.addEventListener('blur', () => {
    if (typeof Y8 !== 'undefined' && Y8.game) {
        Y8.game.pause();
    }
}); 