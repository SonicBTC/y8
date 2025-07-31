export default class Snake {
    constructor(startX, startY, initialLength = 3, direction = {x: 1, y: 0}) {
        this.body = [];
        this.initialDirection = { ...direction };
        this.evolutionStage = 'baby'; // baby -> juvenile -> adult -> legendary
        this.specialAbility = null;
        this.abilityCharges = 0;
        this.reset(startX, startY, initialLength, direction);
    }

    setDirection(dir) {
        // Prevent reversing
        if (dir.x === -this.direction.x && dir.y === -this.direction.y) return;
        this.nextDirection = { ...dir };
    }

    update() {
        // Only update if we have a valid direction
        if (this.nextDirection.x === 0 && this.nextDirection.y === 0) {
            return; // Don't move if no direction set
        }
        
        this.direction = { ...this.nextDirection };
        const newHead = {
            x: this.body[0].x + this.direction.x,
            y: this.body[0].y + this.direction.y
        };
        this.body.unshift(newHead);
        if (this.growAmount > 0) {
            this.growAmount--;
        } else {
            this.body.pop();
        }
    }

    grow(amount = 1) {
        this.growAmount += amount;
    }

    getHead() {
        return this.body[0];
    }

    checkSelfCollision() {
        const [head, ...body] = this.body;
        return body.some(segment => segment.x === head.x && segment.y === head.y);
    }

    reset(startX, startY, initialLength = 3, direction = {x: 1, y: 0}) {
        this.body = [];
        this.initialDirection = { ...direction };
        
        // Create snake body segments
        for (let i = 0; i < initialLength; i++) {
            this.body.push({ 
                x: startX - i * direction.x, 
                y: startY - i * direction.y 
            });
        }
        
        this.direction = { ...direction };
        this.nextDirection = { ...direction }; // Start moving immediately
        this.growAmount = 0;
    }

    hasMoved() {
        return this.direction.x !== 0 || this.direction.y !== 0;
    }

    // Evolution system - MUCH RARER to reduce frustration
    checkEvolution() {
        const length = this.body.length;
        let newStage = this.evolutionStage;
        let newAbility = this.specialAbility;
        let charges = this.abilityCharges;

        // EXTREMELY high thresholds - evolution happens very rarely
        if (length >= 100 && this.evolutionStage !== 'legendary') {
            newStage = 'legendary';
            newAbility = 'teleport';
            charges = 3;
        } else if (length >= 70 && this.evolutionStage !== 'adult') {
            newStage = 'adult';
            newAbility = 'phase';
            charges = 2;
        } else if (length >= 40 && this.evolutionStage !== 'juvenile') {
            newStage = 'juvenile';
            newAbility = 'dash';
            charges = 1;
        }

        const evolved = newStage !== this.evolutionStage;
        this.evolutionStage = newStage;
        this.specialAbility = newAbility;
        this.abilityCharges = charges;

        return evolved ? newStage : null;
    }

    getEvolutionInfo() {
        const stages = {
            baby: { name: 'Baby Snake', color: '#87CEEB', description: 'Just a little snake' },
            juvenile: { name: 'Swift Snake', color: '#98FB98', description: 'Can dash through walls!' },
            adult: { name: 'Phase Snake', color: '#DDA0DD', description: 'Can phase through obstacles!' },
            legendary: { name: 'Cosmic Serpent', color: '#FFD700', description: 'Can teleport anywhere!' }
        };
        return stages[this.evolutionStage] || stages.baby;
    }

    useAbility(gameState, boardWidth, boardHeight) {
        if (this.abilityCharges <= 0 || !this.specialAbility) return false;

        switch (this.specialAbility) {
            case 'dash':
                // Dash forward 3 spaces with proper wall wrapping
                const head = this.getHead();
                const newHead = {
                    x: head.x + (this.direction.x * 3),
                    y: head.y + (this.direction.y * 3)
                };
                // Proper wall wrapping for Swift Snake
                if (newHead.x < 0) newHead.x = boardWidth - 1;
                else if (newHead.x >= boardWidth) newHead.x = 0;
                if (newHead.y < 0) newHead.y = boardHeight - 1;
                else if (newHead.y >= boardHeight) newHead.y = 0;
                this.body.unshift(newHead);
                this.body.pop();
                break;

            case 'phase':
                // Become invincible for 3 seconds but keep snake visible
                gameState.invincible = true;
                gameState.phaseMode = true;
                setTimeout(() => {
                    gameState.invincible = false;
                    gameState.phaseMode = false;
                }, 3000);
                break;

            case 'teleport':
                // Teleport to random safe location
                const safeSpots = [];
                for (let x = 0; x < boardWidth; x++) {
                    for (let y = 0; y < boardHeight; y++) {
                        if (!this.body.some(segment => segment.x === x && segment.y === y)) {
                            safeSpots.push({x, y});
                        }
                    }
                }
                if (safeSpots.length > 0) {
                    const newPos = safeSpots[Math.floor(Math.random() * safeSpots.length)];
                    this.body[0] = newPos;
                }
                break;
        }

        this.abilityCharges--;
        return true;
    }
}