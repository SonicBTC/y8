export default class InputManager {
    constructor() {
        this.direction = {x: 1, y: 0};
        this.listeners = [];
        this.setupListeners();
    }

    setupListeners() {
        document.addEventListener('keydown', (e) => {
            let dir = null;
            switch (e.key) {
                case 'ArrowUp': dir = {x: 0, y: -1}; break;
                case 'ArrowDown': dir = {x: 0, y: 1}; break;
                case 'ArrowLeft': dir = {x: -1, y: 0}; break;
                case 'ArrowRight': dir = {x: 1, y: 0}; break;
            }
            if (dir) {
                this.direction = dir;
                this.listeners.forEach(cb => cb(dir));
            }
        });
        // TODO: Add touch/swipe support
    }

    onDirectionChange(callback) {
        this.listeners.push(callback);
    }
}