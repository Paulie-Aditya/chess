import { Board } from "../Board";
import { Position, Color, Move } from "chess-shared/types";
import { MoveValidator } from "./MoveValidator";

export function isSquareAttacked(board: Board, pos: Position, attackerColor: Color): boolean {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board.getPiece({ row, col });
            if (piece && piece.color === attackerColor) {
                const from = { row, col };
                if (MoveValidator.isMoveLegal(from, pos, board)) {
                    return true;
                }
            }
        }
    }
    return false;
}

export function isInCheck(board: Board, color: Color): boolean {
    const kingPos = findKing(board, color);
    if (!kingPos) return false;
    const opponent = color === "white" ? "black" : "white";
    return isSquareAttacked(board, kingPos, opponent);
}

export function isCheckmate(board: Board, color: Color): boolean {
    if (!isInCheck(board, color)) return false;
    return !hasLegalMoves(board, color);
}

export function isStalemate(board: Board, color: Color): boolean {
    if (isInCheck(board, color)) return false;
    return !hasLegalMoves(board, color);
}

export function hasLegalMoves(board: Board, color: Color): boolean {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board.getPiece({ row: fromRow, col: fromCol });
            if (piece && piece.color === color) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        const from = { row: fromRow, col: fromCol };
                        const to = { row: toRow, col: toCol };
                        if (MoveValidator.isMoveLegal(from, to, board)) {
                            // Try the move
                            const tempBoard = board.clone();
                            tempBoard.movePiece(from, to);
                            // Check if the move leaves the king in check
                            if (!isInCheck(tempBoard, color)) {
                                return true;
                            }
                        }
                    }
                }
            }
        }
    }
    return false;
}

function findKing(board: Board, color: Color): Position | null {
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board.getPiece({ row, col });
            if (piece?.type === "king" && piece.color === color) {
                return { row, col };
            }
        }
    }
    return null;
}
