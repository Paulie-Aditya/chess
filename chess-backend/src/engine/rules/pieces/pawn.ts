import { Position, Color, Piece } from "chess-shared/types";
import { Board } from "../../Board";

export function isValidPawnMove(
    from: Position, 
    to: Position, 
    board: Board, 
    color: Color,
    enPassantTarget?: Position
): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    const direction = color === "white" ? -1 : 1;
    const target = board.getPiece(to);

    // Forward 1 square
    if (to.col === from.col && to.row === from.row + direction && !target) {
        return true;
    }

    // Forward 2 squares from starting position
    if (
        !piece.hasMoved &&
        to.col === from.col &&
        to.row === from.row + 2 * direction
    ) {
        const mid = board.getPiece({row: from.row + direction, col: from.col});
        if (!mid && !target) return true;
    }

    // Diagonal capture
    if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction) {
        if (target && target.color !== color) return true;
    }

    // En passant capture
    if (enPassantTarget && 
        Math.abs(to.col - from.col) === 1 && 
        to.row === from.row + direction &&
        to.row === enPassantTarget.row &&
        to.col === enPassantTarget.col) {
        const adjacentPiece = board.getPiece({row: from.row, col: to.col});
        if (adjacentPiece?.type === "pawn" && adjacentPiece.color !== color) {
            return true;
        }
    }

    return false;
}

export function isPromotionMove(to: Position, color: Color): boolean {
    return (color === "white" && to.row === 0) || (color === "black" && to.row === 7);
}

export function getPromotionOptions(): Piece["type"][] {
    return ["queen", "rook", "bishop", "knight"];
}
