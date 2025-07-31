export default class Portal {
    constructor(x, y, color = '#9b59b6', linkedPortal = null) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.linkedPortal = linkedPortal;
        this.active = true;
        this.cooldown = 0;
        this.animationPhase = 0;
    }

    static createPortalPair(gridWidth, gridHeight, snakeBody) {
        // Find two safe positions for portals
        const safeSpots = [];
        for (let x = 0; x < gridWidth; x++) {
            for (let y = 0; y < gridHeight; y++) {
                if (!snakeBody.some(segment => segment.x === x && segment.y === y)) {
                    safeSpots.push({x, y});
                }
            }
        }

        if (safeSpots.length < 2) return null;

        // Pick two random safe spots
        const spot1 = safeSpots[Math.floor(Math.random() * safeSpots.length)];
        const spot2 = safeSpots.filter(spot => 
            Math.abs(spot.x - spot1.x) + Math.abs(spot.y - spot1.y) > 5
        )[Math.floor(Math.random() * safeSpots.length)];

        if (!spot2) return null;

        // Create linked portals with different colors
        const portal1 = new Portal(spot1.x, spot1.y, '#9370DB'); // Medium Purple
        const portal2 = new Portal(spot2.x, spot2.y, '#20B2AA'); // Light Sea Green
        
        portal1.linkedPortal = portal2;
        portal2.linkedPortal = portal1;

        return [portal1, portal2];
    }

    teleport(snake) {
        if (!this.linkedPortal || this.cooldown > 0 || !this.active) return false;

        const head = snake.getHead();
        if (head.x !== this.x || head.y !== this.y) return false;

        // Teleport snake head to linked portal
        snake.body[0] = { x: this.linkedPortal.x, y: this.linkedPortal.y };
        
        // Set cooldown for both portals
        this.cooldown = 1000; // 1 second cooldown
        this.linkedPortal.cooldown = 1000;

        return true;
    }

    update(delta) {
        if (this.cooldown > 0) {
            this.cooldown = Math.max(0, this.cooldown - delta);
        }
        this.animationPhase += delta * 0.005;
    }

    isReady() {
        return this.cooldown === 0 && this.active;
    }

    getAnimatedColor() {
        if (!this.isReady()) {
            return '#666'; // Gray when on cooldown
        }
        
        // Pulsing effect
        const pulse = Math.sin(this.animationPhase) * 0.3 + 0.7;
        const r = parseInt(this.color.substr(1, 2), 16);
        const g = parseInt(this.color.substr(3, 2), 16);
        const b = parseInt(this.color.substr(5, 2), 16);
        
        return `rgb(${Math.floor(r * pulse)}, ${Math.floor(g * pulse)}, ${Math.floor(b * pulse)})`;
    }
}