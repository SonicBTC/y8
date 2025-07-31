export default class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.active = true;
        this.duration = 5000; // 5 seconds
        this.startTime = null;
    }

    static getRandomType() {
        const types = ['speed', 'shrink', 'invincible', 'doublePoints'];
        return types[Math.floor(Math.random() * types.length)];
    }

    apply(snake, gameState) {
        this.startTime = Date.now();
        switch (this.type) {
            case 'speed':
                gameState.speedMultiplier = 0.7;
                break;
            case 'shrink':
                // Remove last 2 segments
                for (let i = 0; i < 2 && snake.body.length > 3; i++) {
                    snake.body.pop();
                }
                break;
            case 'invincible':
                gameState.invincible = true;
                break;
            case 'doublePoints':
                gameState.pointMultiplier = 2;
                break;
        }
    }

    remove(gameState) {
        switch (this.type) {
            case 'speed':
                gameState.speedMultiplier = 1;
                break;
            case 'invincible':
                gameState.invincible = false;
                break;
            case 'doublePoints':
                gameState.pointMultiplier = 1;
                break;
        }
    }

    isExpired() {
        return this.startTime && (Date.now() - this.startTime) > this.duration;
    }

    getColor() {
        switch (this.type) {
            case 'speed': return '#32CD32';      // Lime Green
            case 'shrink': return '#FF69B4';     // Hot Pink
            case 'invincible': return '#FFD700'; // Gold
            case 'doublePoints': return '#00CED1'; // Dark Turquoise
            default: return '#FF6347';           // Tomato Red
        }
    }
} 