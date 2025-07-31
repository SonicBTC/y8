export default class SettingsMenu {
    constructor(audioManager, onSettingsChange) {
        this.audioManager = audioManager;
        this.onSettingsChange = onSettingsChange;
        this.settings = this.loadSettings();
        this.createMenu();
    }

    loadSettings() {
        const defaultSettings = {
            soundEnabled: true,
            musicEnabled: true,
            volume: 0.5,
            difficulty: 'normal',
            controls: 'keyboard',
            theme: 'default'
        };

        const saved = localStorage.getItem('snakeGameSettings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettings() {
        localStorage.setItem('snakeGameSettings', JSON.stringify(this.settings));
        // Notify parent about settings change
        if (this.onSettingsChange) {
            this.onSettingsChange(this.settings);
        }
    }

    createMenu() {
        const menu = document.createElement('div');
        menu.className = 'settings-menu';
        menu.innerHTML = `
            <div class="settings-content">
                <h2>Settings</h2>
                <div class="setting-group">
                    <label>Sound Effects</label>
                    <input type="checkbox" id="soundToggle" ${this.settings.soundEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-group">
                    <label>Background Music</label>
                    <input type="checkbox" id="musicToggle" ${this.settings.musicEnabled ? 'checked' : ''}>
                </div>
                <div class="setting-group">
                    <label>Volume</label>
                    <input type="range" id="volumeSlider" min="0" max="1" step="0.1" value="${this.settings.volume}">
                </div>
                <div class="setting-group">
                    <label>Difficulty</label>
                    <select id="difficultySelect">
                        <option value="easy" ${this.settings.difficulty === 'easy' ? 'selected' : ''}>Easy (Slower)</option>
                        <option value="normal" ${this.settings.difficulty === 'normal' ? 'selected' : ''}>Normal</option>
                        <option value="hard" ${this.settings.difficulty === 'hard' ? 'selected' : ''}>Hard (Faster)</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label>Controls</label>
                    <select id="controlsSelect">
                        <option value="keyboard" ${this.settings.controls === 'keyboard' ? 'selected' : ''}>Keyboard</option>
                        <option value="touch" ${this.settings.controls === 'touch' ? 'selected' : ''}>Touch</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label>Theme</label>
                    <select id="themeSelect">
                        <option value="default" ${this.settings.theme === 'default' ? 'selected' : ''}>Default</option>
                        <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Dark</option>
                        <option value="neon" ${this.settings.theme === 'neon' ? 'selected' : ''}>Neon</option>
                    </select>
                </div>
                <div class="setting-buttons">
                    <button id="saveSettings" class="game-button">Save</button>
                    <button id="closeSettings" class="game-button">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(menu);
        this.setupEventListeners(menu);
    }

    setupEventListeners(menu) {
        const soundToggle = menu.querySelector('#soundToggle');
        const musicToggle = menu.querySelector('#musicToggle');
        const volumeSlider = menu.querySelector('#volumeSlider');
        const difficultySelect = menu.querySelector('#difficultySelect');
        const controlsSelect = menu.querySelector('#controlsSelect');
        const themeSelect = menu.querySelector('#themeSelect');
        const saveButton = menu.querySelector('#saveSettings');
        const closeButton = menu.querySelector('#closeSettings');

        soundToggle.addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.audioManager.soundEnabled = e.target.checked;
        });

        musicToggle.addEventListener('change', (e) => {
            this.settings.musicEnabled = e.target.checked;
            this.audioManager.musicEnabled = e.target.checked;
        });

        volumeSlider.addEventListener('input', (e) => {
            this.settings.volume = parseFloat(e.target.value);
            this.audioManager.setVolume(this.settings.volume);
        });

        difficultySelect.addEventListener('change', (e) => {
            this.settings.difficulty = e.target.value;
        });

        controlsSelect.addEventListener('change', (e) => {
            this.settings.controls = e.target.value;
        });

        themeSelect.addEventListener('change', (e) => {
            this.settings.theme = e.target.value;
            this.applyTheme(e.target.value);
        });

        saveButton.addEventListener('click', () => {
            this.saveSettings();
            this.audioManager.playButton();
            this.hide();
        });

        closeButton.addEventListener('click', () => {
            this.hide();
        });

        this.menu = menu;
    }

    applyTheme(theme) {
        document.body.className = `theme-${theme}`;
    }

    show() {
        this.menu.style.display = 'flex';
    }

    hide() {
        this.menu.style.display = 'none';
    }

    getSettings() {
        return this.settings;
    }
} 