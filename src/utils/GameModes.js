export default class GameModes {
    static CLASSIC = 'classic';
    static TIMED = 'timed';
    static ENDLESS = 'endless';
    static CHALLENGE = 'challenge';

    static getModeConfig(mode) {
        switch (mode) {
            case this.CLASSIC:
                return {
                    name: 'Classic',
                    description: 'Traditional Snake game with increasing difficulty',
                    timeLimit: null,
                    obstacles: false,
                    powerUps: true,
                    wallCollision: true,
                    speedIncrease: true
                };
            case this.TIMED:
                return {
                    name: 'Timed',
                    description: 'Race against the clock!',
                    timeLimit: 120, // 2 minutes
                    obstacles: false,
                    powerUps: true,
                    wallCollision: true,
                    speedIncrease: false
                };
            case this.ENDLESS:
                return {
                    name: 'Endless',
                    description: 'No walls, infinite play area',
                    timeLimit: null,
                    obstacles: true,
                    powerUps: true,
                    wallCollision: false,
                    speedIncrease: true
                };
            case this.CHALLENGE:
                return {
                    name: 'Challenge',
                    description: 'Obstacles and power-ups galore!',
                    timeLimit: null,
                    obstacles: true,
                    powerUps: true,
                    wallCollision: true,
                    speedIncrease: true
                };
            default:
                return this.getModeConfig(this.CLASSIC);
        }
    }

    static getInitialSpeed(mode) {
        switch (mode) {
            case this.TIMED:
                return 100; // Faster for timed mode
            case this.CHALLENGE:
                return 80; // Fastest for challenge mode
            default:
                return 120; // Normal speed
        }
    }

    static getSpeedIncrease(mode) {
        switch (mode) {
            case this.TIMED:
                return 0; // No speed increase in timed mode
            case this.CHALLENGE:
                return 15; // Faster speed increase
            default:
                return 10; // Normal speed increase
        }
    }

    static getObstacleFrequency(mode) {
        switch (mode) {
            case this.ENDLESS:
            case this.CHALLENGE:
                return 0.05; // 5% chance per food eaten
            default:
                return 0; // No obstacles
        }
    }

    static getPowerUpFrequency(mode) {
        switch (mode) {
            case this.CHALLENGE:
                return 0.2; // 20% chance per food eaten
            case this.TIMED:
                return 0.15; // 15% chance per food eaten
            default:
                return 0.1; // 10% chance per food eaten
        }
    }

    static getScoreMultiplier(mode) {
        switch (mode) {
            case this.TIMED:
                return 2; // Double points for timed mode
            case this.CHALLENGE:
                return 1.5; // 1.5x points for challenge mode
            default:
                return 1; // Normal points
        }
    }

    static getTimeBonus(mode, timeRemaining) {
        if (mode === this.TIMED && timeRemaining > 0) {
            return Math.floor(timeRemaining * 10); // 10 points per second remaining
        }
        return 0;
    }

    static shouldSpawnObstacle(mode, level) {
        const config = this.getModeConfig(mode);
        if (!config.obstacles) return false;
        
        const frequency = this.getObstacleFrequency(mode);
        return Math.random() < frequency && level > 2;
    }

    static shouldSpawnPowerUp(mode) {
        const frequency = this.getPowerUpFrequency(mode);
        return Math.random() < frequency;
    }

    static checkWallCollision(mode, head, boardWidth, boardHeight) {
        const config = this.getModeConfig(mode);
        if (!config.wallCollision) return false;
        
        return head.x < 0 || head.x >= boardWidth || head.y < 0 || head.y >= boardHeight;
    }

    static wrapPosition(mode, head, boardWidth, boardHeight) {
        const config = this.getModeConfig(mode);
        if (config.wallCollision) return head;
        
        return {
            x: (head.x + boardWidth) % boardWidth,
            y: (head.y + boardHeight) % boardHeight
        };
    }
} 