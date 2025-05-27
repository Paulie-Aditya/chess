import { Game } from "./engine/Game";

const game = new Game();
game.printState();

// Sample move
game.move({ row: 6, col: 4 }, { row: 4, col: 4 }); // e2 to e4
console.log("\nAfter move:");
game.printState();
