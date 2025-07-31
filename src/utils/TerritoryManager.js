export default class TerritoryManager {
    constructor(gridWidth, gridHeight) {
        this.gridWidth = gridWidth;
        this.gridHeight = gridHeight;
        this.claimedTiles = new Set();
        this.pendingPath = [];
        this.territoryScore = 0;
    }

    reset() {
        this.claimedTiles.clear();
        this.pendingPath = [];
        this.territoryScore = 0;
    }

    // Check if snake is creating a territory
    updatePath(snakeHead, snakeBody) {
        const headKey = `${snakeHead.x},${snakeHead.y}`;
        
        // If head is on already claimed territory, start new path
        if (this.claimedTiles.has(headKey)) {
            this.pendingPath = [headKey];
            return null;
        }
        
        // Add to pending path
        this.pendingPath.push(headKey);
        
        // Check if we've completed a loop (head touches claimed territory again)
        // Only check for territory claiming every 10 moves to reduce frequency
        if (this.pendingPath.length % 10 === 0) {
            const touchesClaimed = this.pendingPath.length > 20 && 
                this.isAdjacentToClaimed(snakeHead.x, snakeHead.y);
            
            if (touchesClaimed) {
                return this.claimEnclosedArea();
            }
        }
        
        return null;
    }

    isAdjacentToClaimed(x, y) {
        const directions = [
            {x: 0, y: -1}, {x: 1, y: 0}, {x: 0, y: 1}, {x: -1, y: 0}
        ];
        
        return directions.some(dir => {
            const checkKey = `${x + dir.x},${y + dir.y}`;
            return this.claimedTiles.has(checkKey);
        });
    }

    claimEnclosedArea() {
        if (this.pendingPath.length < 15) return null; // Require larger area to claim
        
        // Convert path to coordinates
        const pathCoords = this.pendingPath.map(key => {
            const [x, y] = key.split(',').map(Number);
            return {x, y};
        });
        
        // Use flood fill to find enclosed area
        const enclosedTiles = this.floodFillEnclosed(pathCoords);
        
        if (enclosedTiles.length > 0) {
            // Claim all enclosed tiles and the path
            this.pendingPath.forEach(key => this.claimedTiles.add(key));
            enclosedTiles.forEach(tile => {
                this.claimedTiles.add(`${tile.x},${tile.y}`);
            });
            
            const claimedCount = enclosedTiles.length + this.pendingPath.length;
            this.territoryScore += claimedCount * 5;
            this.pendingPath = [];
            
            return {
                tilesClaimedCount: claimedCount,
                bonusScore: claimedCount * 5,
                totalTerritoryScore: this.territoryScore
            };
        }
        
        return null;
    }

    floodFillEnclosed(pathCoords) {
        // Simple flood fill algorithm to find enclosed area
        const enclosed = [];
        const visited = new Set();
        const pathSet = new Set(this.pendingPath);
        
        // Find a point inside the path (simplified approach)
        const minX = Math.min(...pathCoords.map(p => p.x));
        const maxX = Math.max(...pathCoords.map(p => p.x));
        const minY = Math.min(...pathCoords.map(p => p.y));
        const maxY = Math.max(...pathCoords.map(p => p.y));
        
        // Try points inside the bounding box
        for (let x = minX + 1; x < maxX; x++) {
            for (let y = minY + 1; y < maxY; y++) {
                const key = `${x},${y}`;
                if (!visited.has(key) && !pathSet.has(key) && !this.claimedTiles.has(key)) {
                    if (this.isPointInsidePath(x, y, pathCoords)) {
                        enclosed.push({x, y});
                        visited.add(key);
                    }
                }
            }
        }
        
        return enclosed;
    }

    // Ray casting algorithm to check if point is inside polygon
    isPointInsidePath(x, y, pathCoords) {
        let inside = false;
        let j = pathCoords.length - 1;
        
        for (let i = 0; i < pathCoords.length; i++) {
            const xi = pathCoords[i].x, yi = pathCoords[i].y;
            const xj = pathCoords[j].x, yj = pathCoords[j].y;
            
            if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
                inside = !inside;
            }
            j = i;
        }
        
        return inside;
    }

    isTileClaimed(x, y) {
        return this.claimedTiles.has(`${x},${y}`);
    }

    getTerritoryPercentage() {
        const totalTiles = this.gridWidth * this.gridHeight;
        return (this.claimedTiles.size / totalTiles * 100).toFixed(1);
    }

    getClaimedTiles() {
        return Array.from(this.claimedTiles).map(key => {
            const [x, y] = key.split(',').map(Number);
            return {x, y};
        });
    }

    getPendingPath() {
        return this.pendingPath.map(key => {
            const [x, y] = key.split(',').map(Number);
            return {x, y};
        });
    }
}