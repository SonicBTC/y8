export default class HUD {
    constructor(scoreElement, highScoreElement, overlayElement) {
        this.scoreElement = scoreElement;
        this.highScoreElement = highScoreElement;
        this.overlayElement = overlayElement;
    }

    setScore(score) {
        this.scoreElement.textContent = score;
    }

    setHighScore(highScore) {
        this.highScoreElement.textContent = highScore;
    }

    showOverlay(title, message, buttonText, onButtonClick) {
        this.overlayElement.querySelector('#overlayTitle').textContent = title;
        this.overlayElement.querySelector('#overlayMessage').textContent = message;
        const button = this.overlayElement.querySelector('.game-button');
        button.textContent = buttonText;
        button.onclick = onButtonClick;
        this.overlayElement.style.display = 'flex';
    }

    hideOverlay() {
        this.overlayElement.style.display = 'none';
    }
}