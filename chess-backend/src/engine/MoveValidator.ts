import { Position } from "chess-shared/types";
import { Board } from "./Board";

export class MoveValidator {
  static isMoveLegal(from: Position, to: Position, board: Board): boolean {
    const piece = board.getPiece(from);
    const target = board.getPiece(to);

    if (!piece) return false;

    if (target && target.color === piece.color) return false;

    // Add actual move logic here
    return true;
  }
}
