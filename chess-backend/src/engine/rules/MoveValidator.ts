import { Board } from "../Board";
import { Position, Color } from "chess-shared/types";
import { isValidPawnMove } from "./pieces/pawn";
import { isValidRookMove } from "./pieces/rook";
import { isValidBishopMove } from "./pieces/bishop";
import { isValidKnightMove } from "./pieces/knight";
import { isValidQueenMove } from "./pieces/queen";
import { isValidKingMove } from "./pieces/king";
import { isInCheck } from "./CheckDetection";

export class MoveValidator {
    static isMoveLegal(
        from: Position,
        to: Position,
        board: Board,
        enPassantTarget?: Position,
        castlingRights?: { [key: string]: boolean }
    ): boolean {
        const piece = board.getPiece(from);
        if (!piece) return false;

        // Try the move on a temporary board
        const tempBoard = board.clone();
        tempBoard.movePiece(from, to);

        // Check if the move leaves the king in check
        if (isInCheck(tempBoard, piece.color)) {
            return false;
        }

        // Validate piece-specific moves
        switch (piece.type) {
            case 'pawn':
                return isValidPawnMove(from, to, board, piece.color, enPassantTarget);
            case 'rook':
                return isValidRookMove(from, to, board);
            case 'bishop':
                return isValidBishopMove(from, to, board);
            case 'knight':
                return isValidKnightMove(from, to, board);
            case 'queen':
                return isValidQueenMove(from, to, board);
            case 'king':
                return isValidKingMove(from, to, board, castlingRights || {});
            default:
                return false;
        }
    }

    static getLegalMoves(
        from: Position,
        board: Board,
        enPassantTarget?: Position,
        castlingRights?: { [key: string]: boolean }
    ): Position[] {
        const piece = board.getPiece(from);
        if (!piece) return [];

        const legalMoves: Position[] = [];

        // Check all possible squares
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const to = { row, col };
                if (this.isMoveLegal(from, to, board, enPassantTarget, castlingRights)) {
                    legalMoves.push(to);
                }
            }
        }

        return legalMoves;
    }
}
