export default class Food {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.position = this.randomPosition();
    }

    randomPosition() {
        return {
            x: Math.floor(Math.random() * this.gridWidth),
            y: Math.floor(Math.random() * this.gridHeight)
        };
    }

    respawn(snakeBody) {
        let newPos;
        do {
            newPos = this.randomPosition();
        } while (snakeBody.some(segment => segment.x === newPos.x && segment.y === newPos.y));
        this.position = newPos;
    }
}