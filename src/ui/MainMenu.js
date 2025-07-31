export default class MainMenu {
    constructor(onGameStart, onSettingsOpen) {
        this.onGameStart = onGameStart;
        this.onSettingsOpen = onSettingsOpen;
        this.createMenu();
    }

    createMenu() {
        const menu = document.createElement('div');
        menu.className = 'main-menu';
        menu.innerHTML = `
            <div class="menu-content">
                <h1 class="menu-title">🐍 Snake Adventure</h1>
                <div class="menu-subtitle">Choose Your Game Mode</div>
                
                <div class="game-modes">
                    <div class="mode-card" data-mode="classic">
                        <h3>Classic</h3>
                        <p>Traditional Snake game with increasing difficulty</p>
                        <div class="mode-features">
                            <span>✓ Power-ups</span>
                            <span>✓ Speed increase</span>
                        </div>
                    </div>
                    
                    <div class="mode-card" data-mode="timed">
                        <h3>Timed</h3>
                        <p>Race against the clock!</p>
                        <div class="mode-features">
                            <span>⏱️ 2 minutes</span>
                            <span>✓ Double points</span>
                        </div>
                    </div>
                    
                    <div class="mode-card" data-mode="endless">
                        <h3>Endless</h3>
                        <p>No walls, infinite play area</p>
                        <div class="mode-features">
                            <span>∞ No walls</span>
                            <span>✓ Obstacles</span>
                        </div>
                    </div>
                    
                    <div class="mode-card" data-mode="challenge">
                        <h3>Challenge</h3>
                        <p>Obstacles and power-ups galore!</p>
                        <div class="mode-features">
                            <span>⚠️ Obstacles</span>
                            <span>⚡ Fast pace</span>
                        </div>
                    </div>
                </div>
                
                <div class="menu-buttons">
                    <button id="settingsBtn" class="menu-button secondary">Settings</button>
                    <button id="leaderboardBtn" class="menu-button secondary">Leaderboard</button>
                </div>
                
                <div class="menu-footer">
                    <p>High Score: <span id="menuHighScore">0</span></p>
                </div>
            </div>
        `;

        document.body.appendChild(menu);
        this.setupEventListeners(menu);
        this.menu = menu;
    }

    setupEventListeners(menu) {
        const modeCards = menu.querySelectorAll('.mode-card');
        const settingsBtn = menu.querySelector('#settingsBtn');
        const leaderboardBtn = menu.querySelector('#leaderboardBtn');

        modeCards.forEach(card => {
            card.addEventListener('click', () => {
                const mode = card.dataset.mode;
                this.selectMode(mode);
            });
            
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'scale(1.05)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'scale(1)';
            });
        });

        settingsBtn.addEventListener('click', () => {
            this.onSettingsOpen();
        });

        leaderboardBtn.addEventListener('click', () => {
            this.showLeaderboard();
        });

        this.updateHighScore();
    }

    selectMode(mode) {
        this.hide();
        this.onGameStart(mode);
    }

    showLeaderboard() {
        // TODO: Implement leaderboard display
        alert('Leaderboard coming soon!');
    }

    updateHighScore() {
        const highScore = localStorage.getItem('snakeHighScore') || 0;
        const highScoreElement = this.menu.querySelector('#menuHighScore');
        if (highScoreElement) {
            highScoreElement.textContent = highScore;
        }
    }

    show() {
        this.menu.style.display = 'flex';
        this.updateHighScore();
    }

    hide() {
        this.menu.style.display = 'none';
    }
} 