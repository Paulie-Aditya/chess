import { Position } from "chess-shared/types";
import { Board } from "../Board";
import { isValidPawnMove } from "./pieces/pawn";
import { isValidKnightMove } from "./pieces/knight";
import {isValidBishopMove} from "./pieces/bishop"
import {isValidRookMove} from "./pieces/rook";
import {isValidQueenMove} from "./pieces/queen";
import {isValidKingMove} from "./pieces/king"


export class MoveValidator {
  static isMoveLegal(from: Position, to: Position, board: Board): boolean {
    const piece = board.getPiece(from);
    const target = board.getPiece(to);
    if (!piece) return false;
    if (target && target.color === piece.color) return false;

    switch (piece.type) {
        case "pawn": return isValidPawnMove(from, to, board, piece.color);
        case "knight": return isValidKnightMove(from, to);
        case "bishop": return isValidBishopMove(from, to, board);
        case "rook": return isValidRookMove(from, to, board);
        case "queen": return isValidQueenMove(from, to, board);
        case "king": return isValidKingMove(from, to, board);
        default: return false;
    }
  }
}
