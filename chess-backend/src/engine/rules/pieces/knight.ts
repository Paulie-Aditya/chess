import { Position, Color } from "chess-shared/types";
import { Board } from "../../Board";

export function isValidKnightMove(from: Position, to: Position, board: Board): boolean {
    const piece = board.getPiece(from);
    if (!piece) return false;

    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    
    if (!((rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2))) {
        return false;
    }

    const target = board.getPiece(to);
    return !target || target.color !== piece.color;
}
