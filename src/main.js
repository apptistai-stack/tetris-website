/**
 * Main Game Entry Point
 */

console.log("Web Tetris Initializing...");

import { Game } from './core/game.js';

console.log("Web Tetris Initializing...");

const canvas = document.getElementById('game-board');

// Start the game
const game = new Game(canvas);
game.start();

// Expose game for debugging
window.game = game;
