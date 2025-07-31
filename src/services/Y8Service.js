export default class Y8Service {
    constructor() {
        this.initialized = false;
        this.user = null;
        this.ads = null;
        this.analytics = null;
    }

    async init() {
        if (typeof Y8 === 'undefined') {
            console.log('Y8 SDK not available, running in standalone mode');
            return false;
        }

        try {
            await Y8.init({
                appId: 'snake-adventure-game',
                onReady: () => {
                    console.log('Y8 SDK initialized');
                    this.initialized = true;
                    this.loadUserData();
                },
                onError: (error) => {
                    console.error('Y8 SDK error:', error);
                }
            });
            return true;
        } catch (error) {
            console.error('Failed to initialize Y8 SDK:', error);
            return false;
        }
    }

    async loadUserData() {
        if (!this.initialized || !Y8.user) return null;

        try {
            this.user = await Y8.user.getProfile();
            console.log('User profile loaded:', this.user);
            return this.user;
        } catch (error) {
            console.error('Error loading user profile:', error);
            return null;
        }
    }

    async showAd(adType = 'interstitial') {
        if (!this.initialized || !Y8.ads) return false;

        try {
            await Y8.ads.showAd(adType);
            console.log(`${adType} ad displayed successfully`);
            return true;
        } catch (error) {
            console.error(`Error showing ${adType} ad:`, error);
            return false;
        }
    }

    trackEvent(eventName, data = {}) {
        if (!this.initialized || !Y8.analytics) return;

        try {
            Y8.analytics.track(eventName, {
                ...data,
                timestamp: Date.now(),
                userId: this.user?.id
            });
        } catch (error) {
            console.error('Error tracking event:', error);
        }
    }

    trackGameStart() {
        this.trackEvent('game_started');
    }

    trackGameOver(score, level) {
        this.trackEvent('game_over', { score, level });
    }

    trackFoodEaten(score) {
        this.trackEvent('food_eaten', { score });
    }

    trackPowerUpCollected(powerUpType) {
        this.trackEvent('powerup_collected', { powerUpType });
    }

    trackLevelUp(level) {
        this.trackEvent('level_up', { level });
    }

    trackHighScore(score) {
        this.trackEvent('new_high_score', { score });
    }

    getUserNickname() {
        return this.user?.nickname || 'Player';
    }

    getUserLanguage() {
        return this.user?.language || 'en';
    }

    isLoggedIn() {
        return this.initialized && this.user !== null;
    }

    async login() {
        if (!this.initialized || !Y8.auth) return false;

        try {
            await Y8.auth.login();
            await this.loadUserData();
            return true;
        } catch (error) {
            console.error('Login failed:', error);
            return false;
        }
    }

    async logout() {
        if (!this.initialized || !Y8.auth) return false;

        try {
            await Y8.auth.logout();
            this.user = null;
            return true;
        } catch (error) {
            console.error('Logout failed:', error);
            return false;
        }
    }
} 