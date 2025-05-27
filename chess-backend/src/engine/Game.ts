import { Board } from "./Board";
import { MoveValidator } from "./MoveValidator";
import { Position, Color } from "chess-shared/types";

export class Game {
  private board: Board;
  private turn: Color;

  constructor() {
    this.board = new Board();
    this.turn = "white";
  }

  getBoard() {
    return this.board;
  }

  getTurn(): Color {
    return this.turn;
  }

  move(from: Position, to: Position): boolean {
    const piece = this.board.getPiece(from);
    if (!piece || piece.color !== this.turn) return false;

    if (MoveValidator.isMoveLegal(from, to, this.board)) {
      this.board.movePiece(from, to);
      this.turn = this.turn === "white" ? "black" : "white";
      return true;
    }

    return false;
  }

  printState() {
    console.log(`Turn: ${this.turn}`);
    this.board.printBoard();
  }
}
