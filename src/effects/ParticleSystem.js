export default class ParticleSystem {
    constructor() {
        this.particles = [];
        this.maxParticles = 200; // Limit total particles to prevent lag
    }

    createExplosion(x, y, color = '#ffff00', count = 8) { // Reduced from 10
        for (let i = 0; i < count; i++) {
            this.addParticle({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 6,
                vy: (Math.random() - 0.5) * 6,
                color: color,
                life: 1.0,
                decay: 0.025,
                size: Math.random() * 2 + 1
            });
        }
    }

    createEvolutionEffect(x, y) {
        const colors = ['#87CEEB', '#98FB98', '#DDA0DD', '#FFD700', '#FFB6C1'];
        // Reduced particle count for better performance
        for (let i = 0; i < 12; i++) { // Reduced from 20
            this.addParticle({
                x: x,
                y: y,
                vx: (Math.random() - 0.5) * 10, // Slightly reduced speed
                vy: (Math.random() - 0.5) * 10,
                color: colors[Math.floor(Math.random() * colors.length)],
                life: 0.8, // Shorter life
                decay: 0.08,
                size: Math.random() * 3 + 2
            });
        }
    }

    createTerritoryEffect(tiles) {
        // Significantly optimized for better performance
        const maxTiles = Math.min(tiles.length, 10); // Reduced from 20
        for (let j = 0; j < maxTiles; j++) {
            const tile = tiles[j];
            // Reduced to 2 particles per tile
            for (let i = 0; i < 2; i++) { // Reduced from 3
                this.addParticle({
                    x: tile.x * 20 + 10,
                    y: tile.y * 20 + 10,
                    vx: (Math.random() - 0.5) * 8, // Reduced speed
                    vy: (Math.random() - 0.5) * 8,
                    color: '#87CEEB',
                    life: 0.6, // Shorter life
                    decay: 0.06,
                    size: Math.random() * 3 + 1.5
                });
            }
        }
    }

    // Helper method to manage particle count
    addParticle(particle) {
        if (this.particles.length < this.maxParticles) {
            this.particles.push(particle);
        } else {
            // Replace oldest particle if at limit
            this.particles.shift();
            this.particles.push(particle);
        }
    }

    update(delta) {
        // More efficient particle update using for loop instead of filter
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            particle.vx *= 0.95; // Slightly more friction for smoother movement
            particle.vy *= 0.95;
            
            // Remove dead particles
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    render(ctx) {
        // Batch rendering optimizations
        this.particles.forEach(particle => {
            if (particle.life > 0.05) { // Skip nearly invisible particles
                ctx.globalAlpha = particle.life;
                ctx.fillStyle = particle.color;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            }
        });
        
        // Reset alpha once instead of using save/restore
        ctx.globalAlpha = 1;
    }

    clear() {
        this.particles.length = 0; // More efficient than reassigning array
    }

    // Debug method to check particle count
    getParticleCount() {
        return this.particles.length;
    }
}