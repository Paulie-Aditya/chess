import { Position, Color } from "chess-shared/types";
import { Board } from "../../Board";

export function isValidPawnMove(from: Position, to: Position, board: Board, color: Color): boolean {
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
        const mid = board.getPiece({row: from.row + direction , col: from.col});
        if (!mid && !target) return true;
    }

    // Diagonal capture
    if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction) {
        if (target && target.color !== color) return true;
    }

    return false;
}
