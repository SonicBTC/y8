export default class Obstacle {
    constructor(x, y, width = 1, height = 1) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    static generateRandom(gridWidth, gridHeight, snakeBody) {
        let x, y;
        do {
            x = Math.floor(Math.random() * gridWidth);
            y = Math.floor(Math.random() * gridHeight);
        } while (snakeBody.some(segment => 
            segment.x >= x && segment.x < x + 1 && 
            segment.y >= y && segment.y < y + 1
        ));
        
        return new Obstacle(x, y);
    }

    static generateWall(gridWidth, gridHeight) {
        const wallType = Math.floor(Math.random() * 4);
        switch (wallType) {
            case 0: // Horizontal wall
                const y = Math.floor(Math.random() * (gridHeight - 3)) + 1;
                return new Obstacle(0, y, gridWidth, 1);
            case 1: // Vertical wall
                const x = Math.floor(Math.random() * (gridWidth - 3)) + 1;
                return new Obstacle(x, 0, 1, gridHeight);
            case 2: // L-shaped wall
                const lx = Math.floor(Math.random() * (gridWidth - 2));
                const ly = Math.floor(Math.random() * (gridHeight - 2));
                return new Obstacle(lx, ly, 2, 2);
            case 3: // Small block
                const bx = Math.floor(Math.random() * (gridWidth - 1));
                const by = Math.floor(Math.random() * (gridHeight - 1));
                return new Obstacle(bx, by, 1, 1);
        }
    }

    collidesWith(snakeHead) {
        return snakeHead.x >= this.x && 
               snakeHead.x < this.x + this.width &&
               snakeHead.y >= this.y && 
               snakeHead.y < this.y + this.height;
    }
} 