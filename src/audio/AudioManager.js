export default class AudioManager {
    constructor() {
        this.sounds = {};
        this.music = null;
        this.soundEnabled = true;
        this.musicEnabled = true;
        this.volume = 0.5;
        this.initSounds();
    }

    initSounds() {
        // Create audio contexts for different sound effects
        this.sounds = {
            eat: this.createSound(200, 0.1, 'sine'),
            grow: this.createSound(300, 0.1, 'sine'),
            gameOver: this.createSound(100, 0.3, 'sawtooth'),
            powerUp: this.createSound(400, 0.2, 'square'),
            levelUp: this.createSound(500, 0.2, 'triangle'),
            button: this.createSound(150, 0.05, 'sine')
        };
    }

    createSound(frequency, duration, type = 'sine') {
        return () => {
            if (!this.soundEnabled) return;
            
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = frequency;
            oscillator.type = type;
            
            gainNode.gain.setValueAtTime(this.volume, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + duration);
        };
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName]();
        }
    }

    playEat() {
        this.play('eat');
    }

    playGrow() {
        this.play('grow');
    }

    playGameOver() {
        this.play('gameOver');
    }

    playPowerUp() {
        this.play('powerUp');
    }

    playLevelUp() {
        this.play('levelUp');
    }

    playButton() {
        this.play('button');
    }

    toggleSound() {
        this.soundEnabled = !this.soundEnabled;
        return this.soundEnabled;
    }

    toggleMusic() {
        this.musicEnabled = !this.musicEnabled;
        if (this.music) {
            if (this.musicEnabled) {
                this.music.play();
            } else {
                this.music.pause();
            }
        }
        return this.musicEnabled;
    }

    setVolume(volume) {
        this.volume = Math.max(0, Math.min(1, volume));
    }
} 