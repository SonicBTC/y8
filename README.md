# Snake Adventure - Y8 Game

A modern, responsive Snake game designed for Y8 platform integration with AdSense approval requirements.

## 🎮 Game Features

- **Classic Snake Gameplay**: Control a snake to eat food and grow longer
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Y8 SDK Integration**: Full integration with Y8 platform features
- **Ad Integration**: Strategic ad placement points for monetization
- **User Personalization**: Uses Y8 user data for personalized experience
- **Analytics Tracking**: Comprehensive event tracking for game analytics
- **High Score System**: Local storage for persistent high scores

## 🚀 Quick Start

1. **Clone or download** the game files
2. **Open `index.html`** in a web browser to play locally
3. **For Y8 deployment**, upload all files to your web server
4. **Update configuration** in `y8-config.json` with your domain details

## 📁 File Structure

```
snake-adventure/
├── index.html          # Main game page
├── styles.css          # Game styling and responsive design
├── game.js             # Game logic and Y8 SDK integration
├── y8-config.json      # Y8 platform configuration
└── README.md           # This file
```

## 🔧 Y8 Integration Setup

### Required Configuration

Update the following in `y8-config.json`:

```json
{
  "application": {
    "name": "Snake Adventure",
    "link": "https://your-domain.com/snake-adventure",
    "studio_name": "Your Studio Name",
    "studio_email": "your-email@example.com",
    "terms_of_service_uri": "https://your-domain.com/terms",
    "privacy_policy_uri": "https://your-domain.com/privacy"
  }
}
```

### Y8 SDK Features Used

- **User Profile**: Displays user nickname in game title
- **Ad Integration**: Shows ads at strategic points (every 100 points)
- **Analytics**: Tracks game events (start, food eaten, game over, high score)
- **Game State Management**: Handles pause/resume when page visibility changes

### Ad Placement Strategy

- **Game Start**: Optional ad display
- **Every 100 Points**: Interstitial ad to maintain engagement
- **Game Over**: Banner ad for retry motivation
- **High Score Achievement**: Celebration with optional ad

## 🎯 Game Controls

### Desktop
- **Arrow Keys**: Control snake direction
- **Space**: Pause/Resume (optional)

### Mobile
- **Touch Controls**: On-screen directional buttons
- **Responsive**: Automatically adapts to screen size

## 🎨 Customization

### Colors and Styling
Edit `styles.css` to customize:
- Game colors and gradients
- Button styles and animations
- Responsive breakpoints
- Typography and fonts

### Game Mechanics
Modify `game.js` to adjust:
- Game speed and difficulty
- Scoring system
- Ad frequency
- User data integration

## 📊 Analytics Events

The game tracks the following events for Y8 analytics:

- `game_started`: When player starts a new game
- `food_eaten`: When snake eats food (with score)
- `game_over`: When game ends (with final score)
- `new_high_score`: When player achieves new high score

## 🔒 Privacy & Compliance

- **Age Rating**: Suitable for all ages (13+ minimum)
- **Content**: No violence, inappropriate language, or adult content
- **Data Collection**: Only uses Y8-approved user data
- **Local Storage**: High scores stored locally only

## 🌐 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support
- **Mobile Browsers**: Full responsive support

## 🚀 Deployment Checklist

Before submitting to Y8:

- [ ] Update all URLs in `y8-config.json`
- [ ] Test game on multiple devices and browsers
- [ ] Verify ad integration points work correctly
- [ ] Ensure responsive design works properly
- [ ] Test Y8 SDK integration
- [ ] Verify analytics tracking
- [ ] Check content compliance
- [ ] Test game performance

## 📞 Support

For Y8 platform integration questions, refer to:
- [Y8 Terms of Service](https://account.y8.com/app-center/terms-of-service)
- [Y8 Developer Documentation](https://account.y8.com/app-center)

## 📄 License

This game is created for Y8 platform integration. Please ensure compliance with Y8's terms of service and content guidelines.

---

**Note**: This game is designed to meet Y8's AdSense approval requirements with proper ad integration, user data handling, and content compliance. 