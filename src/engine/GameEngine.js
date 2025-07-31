import { GAME_SPEED, DIFFICULTY_SPEEDS } from '../config.js';

export default class GameEngine {
    constructor(update, render, getGameState) {
        this.update = update;
        this.render = render;
        this.getGameState = getGameState;
        this.running = false;
        this.timeoutId = null;
    }

    start() {
        this.running = true;
        this.gameLoop();
    }

    stop() {
        this.running = false;
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    gameLoop = () => {
        if (!this.running) return;
        
        // Get current game state for speed calculation
        const gameState = this.getGameState();
        const baseSpeed = GAME_SPEED; // milliseconds between updates
        const difficultyMultiplier = DIFFICULTY_SPEEDS[gameState.difficulty] || 1.0;
        const levelMultiplier = gameState.speedMultiplier || 1.0;
        const totalMultiplier = difficultyMultiplier * levelMultiplier;
        const updateInterval = baseSpeed / totalMultiplier;
        
        // Update game logic
        this.update(updateInterval);
        
        // Render at the same time
        this.render();
        
        // Schedule next update
        this.timeoutId = setTimeout(this.gameLoop, updateInterval);
    }
}