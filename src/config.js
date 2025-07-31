export const GRID_SIZE = 20;
export const INITIAL_SNAKE_LENGTH = 3;
export const GAME_SPEED = 250; // Balanced speed (250ms between moves = 4 moves per second)
export const BOARD_WIDTH = 20;
export const BOARD_HEIGHT = 20;

// Difficulty-based speed multipliers
export const DIFFICULTY_SPEEDS = {
    easy: 0.7,    // 70% of base speed (slower)
    normal: 1.0,  // 100% of base speed (normal)
    hard: 1.5     // 150% of base speed (faster)
};